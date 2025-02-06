import { log } from "./log.ts"
class FetchData {
    get = async (lcu: string) => {
        let data = (await fetch(lcu)).json()
        return data
    }

    post = async (lcu: string, body: any) => {
        await fetch(lcu, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }
}

class AutoHonor extends FetchData {
    honorType: string
    allies: any[]
    opponents: any[]
    all: any[]
    votesTime: number

    constructor () {
        super();

        this.honorType = "HEART"
        this.allies = []
        this.opponents = []
        this.all = []
        this.votesTime = 0
    }

    getHonorList = async () => {
        let honorList = await (await fetch("/lol-honor-v2/v1/ballot")).json()
        let allPlayerList: Object[] = []

        allPlayerList.push(...honorList.eligibleAllies);
        allPlayerList.push(...honorList.eligibleOpponents);

        this.votesTime = honorList.votePool.votes
        this.allies = honorList.eligibleAllies
        this.opponents = honorList.eligibleOpponents
        this.all = allPlayerList
    }

    honor = async (mode: number) => {
        let i = 0

        let honorPlayer = async (puuid: string) => {
            let body = {
                "recipientPuuid": puuid,
                "honorType": "HEART"
            }
        
            await fetch("/lol-honor/v1/honor", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(body)
            });
        }

        switch (mode) {
            case 0:
                log("Honoring allies..")
                for (let player of this.allies) {
                    await honorPlayer(player.puuid);
                    i++
                }
                break;
            case 1:
                log("Honoring enermy...")
                for (let player of this.opponents) {
                    await honorPlayer(player.puuid);
                    i++
                }
                break;
            case 2: 
                log("Honoring all...")
                for (let player of this.all) {
                    await honorPlayer(player.puuid);
                    i++
                }
                break;
            default:
                log("Auto honor V2 is turn off.")
                break;
        }

        window.Toast.success(`Auto honored ${i} player!`)
    }
}  
let autoHonor = new AutoHonor()

export { autoHonor }