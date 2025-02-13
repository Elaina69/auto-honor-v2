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
    honored: any[]

    constructor () {
        super();

        this.honorType = "HEART"
        this.allies = []
        this.opponents = []
        this.all = []
        this.honored = []
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
        this.honored = honorList.honoredPlayers

        console.log(honorList)
    }

    honor = async (mode: number) => {
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

        if (this.honored.length == 0) {
            switch (mode) {
                case 0:
                    log("Honoring allies..")
                    for (let i = 0; i < this.votesTime; i++) {
                        await honorPlayer(this.allies[i].puuid)
                    }
                    window.Toast.success(`Auto honored ${this.votesTime} player!`)
                    break;
                case 1:
                    log("Honoring enermy...")
                    for (let i = 0; i < this.votesTime; i++) {
                        await honorPlayer(this.opponents[i].puuid)
                    }
                    window.Toast.success(`Auto honored ${this.votesTime} player!`)
                    break;
                case 2: 
                    log("Honoring all...")
                    let i = 0
                    for (i = 0; i < this.all.length; i++) {
                        await honorPlayer(this.all[i].puuid)
                    }
                    window.Toast.success(`Auto honored ${i} player!`)
                    break;
                default:
                    log("Auto honor V2 is turn off.")
                    break;
            }
        }
    }
}  
let autoHonor = new AutoHonor()

export { autoHonor }