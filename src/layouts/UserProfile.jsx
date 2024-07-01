import { useEffect, useState } from "react"
import { loginRequest } from "../auth/authConfig";
import { useMsal } from "@azure/msal-react";
import { callMsGraph } from "../auth/graph";
import { CircularProgress } from "@nextui-org/react";

export default function UserProfile() {

  const { instance, accounts } = useMsal();

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLoggedInUser = () => {
    setLoading(true);
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) => {
          setUserDetails(response)
          setLoading(false);
        }).catch(err => {
          console.log(err);
          setLoading(false)
        });
      }).catch(err => {
        console.log(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    getLoggedInUser();
  }, [])

  return (
    <div className="flex gap-1 mr-2 font-regular items-center">
      {loading ? (
        <CircularProgress size="sm" aria-label="Loading User Details" />
      ) : null}
      {userDetails ? (
        <>
          <div>Hi!</div>
          <div>{userDetails.givenName ? `${userDetails.givenName}` : ""}</div>
          <div>{userDetails.surname ? `${userDetails.surname}` : ""}</div>
        </>
      ) : null}
    </div>
  )
}