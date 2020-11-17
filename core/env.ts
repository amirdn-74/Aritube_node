/**
 *
 * @param env
 * pass the environment name
 */
const env = (env: string) => {
  const nodeEnv = <string>process.env.NODE_ENV!.trim();

  if (nodeEnv === "development") return <string>process.env[env + "_DEV"];
  if (nodeEnv === "test") return <string>process.env[env + "_TEST"];
  return <string>process.env[env];
};

export default env;
