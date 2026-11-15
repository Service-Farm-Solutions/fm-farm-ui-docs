export function shouldBypassAuth({ dev, production, flag, hostname }) {
  return dev === true && production === false && flag === "true" &&
    ["localhost", "127.0.0.1", "::1", "[::1]"].includes(hostname);
}
