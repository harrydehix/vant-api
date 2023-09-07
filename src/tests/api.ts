import startVantageAPI from "../server/server";

async function main(){
    const api = await startVantageAPI({
        useEnvironmentVariables: true,
    });
}

main();