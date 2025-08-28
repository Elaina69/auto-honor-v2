 /**
 * @name Auto-Honor-V2
 * @author Elaina Da Catto
 * @description Auto Honor player
 * @link https://github.com/Elaina69
 * @Nyan Meow~~~
 */

import { log } from "./src/log.ts"
import utils from "./src/utils.ts"
import { autoHonor } from "./src/autoHonor.ts"
import { settings } from "./src/settings.ts"
import { settingsUtils } from "./src/settingsUtils.ts"
import * as upl from "pengu-upl"

if (!window.DataStore.has("Auto-Honor-V2")) {
    window.DataStore.set("Auto-Honor-V2", true)
    window.DataStore.set("Auto-Honor-V2-Mode", 0)
}

let honored = false

let main = async (mode: number) => {
    log("Start running...")
   
    await autoHonor.getHonorList()

    // await utils.stop(1000)
    await autoHonor.honor(mode)

    log("Complete.")
}

let pageListenner = async (node: Element) => {
    const pagename = node.getAttribute("data-screen-name");

    // if (!honored && pagename === "rcp-fe-lol-honor" && window.DataStore.get("Auto-Honor-V2")) {
    //     honored = true
    //     await main(window.DataStore.get("Auto-Honor-V2-Mode"))
    // }
    if (pagename === "rcp-fe-lol-champ-select") honored = false
}

let observeHonorScreen = () => {
    upl.observer.subscribeToElementCreation(".vote-ceremony-player-container", async (element: any) => {
        if (!honored && window.DataStore.get("Auto-Honor-V2")) {
            honored = true
            await main(window.DataStore.get("Auto-Honor-V2-Mode"))
        }
    })
}

window.addEventListener("load", () => {
    settings.injectSettingsUI()

    utils.mutationObserverAddCallback(pageListenner, ["screen-root"])

    observeHonorScreen()
})


export function init (context: any) {
    settingsUtils(context, settings.data)
}