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

    honorPlayer = async (puuid: string) => {
        const body = {
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

    honorPlayerManually = (honorCard: any) => {
        honorCard.click();
    }

    getHonorCards = (mode: number, type: string): Element[] => {
        if (type === "V3") {
            if (mode === 0) {
                return [
                    ...Array.from(document.querySelectorAll(".vote-ceremony-v3-player-component.team-1")),
                    ...Array.from(document.querySelectorAll(".vote-ceremony-v3-player-component.team-2"))
                ];
            } 
            else if (mode === 1) {
                return [
                    ...Array.from(document.querySelectorAll(".vote-ceremony-v3-player-component.team-2")),
                    ...Array.from(document.querySelectorAll(".vote-ceremony-v3-player-component.team-1"))
                ];
            }
        } 
        else {
            if (mode === 0) {
                return [
                    ...Array.from(document.querySelectorAll(".vote-ceremony-player-card.team-1")),
                    ...Array.from(document.querySelectorAll(".vote-ceremony-player-card.team-2"))
                ];
            } 
            else if (mode === 1) {
                return [
                    ...Array.from(document.querySelectorAll(".vote-ceremony-player-card.team-2")),
                    ...Array.from(document.querySelectorAll(".vote-ceremony-player-card.team-1"))
                ];
            }
        }
        return [];
    };

    honor = async (mode: number, type: string) => {
        let failedTime = 0
        let successTime = 0

        for (let i = 0; i < this.votesTime; i++) {
            try {
                await utils.stop(150)
                const honorCards = this.getHonorCards(mode, type)

                log(honorCards)

                this.honorPlayerManually(honorCards[i])
                successTime = successTime + 1
            }
            catch (err) {
                if (failedTime > 100) break
                
                failedTime = failedTime + 1
                i = i - 1

                error("Failed to honor:", err)
            }
        }

        window.Toast.success(`Auto honored ${successTime} player!`);
    }

    skipHonor = (element: any) => {
        if (window.DataStore.get("Auto-Honor-V2") && window.DataStore.get("Auto-Honor-V2_skipHonor")) {
            element.click();
        }
    }

    main = async (mode: number, type: string) => {
        if (this.honored.length !== 0) return;

        switch (mode) {
            case 0:
                log("Honoring allies..");

                this.honor(mode, type);
                break;
            case 1:
                log("Honoring enemy...");

                this.honor(mode, type);
                break;
            default:
                log("Auto honor V2 is turn off.");
                break;
        }
    }
}  

let autoHonor = new AutoHonor()

export { autoHonor }