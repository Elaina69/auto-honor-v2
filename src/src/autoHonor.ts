import { log, error } from "./log.ts"
import utils from "./utils.ts"

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

        let honorPlayerManually = (honorCard: any) => {
            honorCard.click();
        }

        if (this.honored.length == 0) {
            switch (mode) {
                case 0:
                    log("Honoring allies..")
                    
                    for (let i = 0; i < this.votesTime; i++) {
                        // await honorPlayer(this.allies[i].puuid)
                        // await utils.stop(500)

                        try {
                            await utils.stop(150)
                            const team1HonorCards = document.querySelectorAll(".vote-ceremony-player-card.team-1");
                            honorPlayerManually(team1HonorCards[i])
                        }
                        catch (err) {
                            error("Failed to honor ally:", err)
                            i = i - 1
                        }
                    }
                    window.Toast.success(`Auto honored ${this.votesTime} player!`)
                    break;
                case 1:
                    log("Honoring enermy...")
                    
                    for (let i = 0; i < this.votesTime; i++) {
                        // await honorPlayer(this.opponents[i].puuid)
                        // await utils.stop(500)

                        try {
                            await utils.stop(150)
                            let team2HonorCards = document.querySelectorAll(".vote-ceremony-player-card.team-2");
                            honorPlayerManually(team2HonorCards[i])
                        }
                        catch (err) {
                            error("Failed to honor enemy:", err)
                            i = i - 1
                        }
                    }
                    window.Toast.success(`Auto honored ${this.votesTime} player!`)
                    break;
                // case 2: 
                //     log("Honoring all...")
                //     let i = 0
                //     for (i = 0; i < this.all.length; i++) {
                //         await honorPlayer(this.all[i].puuid)
                //         await utils.stop(500)
                //     }
                //     window.Toast.success(`Auto honored ${i} player!`)
                //     break;
                default:
                    log("Auto honor V2 is turn off.")
                    break;
            }
        }
    }
}  
let autoHonor = new AutoHonor()

export { autoHonor }