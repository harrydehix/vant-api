import startVantageAPI from "../api/api";

async function main(){
    const api = await startVantageAPI({
        useEnvironmentVariables: true,
    });
}

main();