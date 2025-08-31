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

if (!window.DataStore.has("Auto-Honor-V2")) window.DataStore.set("Auto-Honor-V2", true)
if (!window.DataStore.has("Auto-Honor-V2-Mode")) window.DataStore.set("Auto-Honor-V2-Mode", 0)
if (!window.DataStore.has("Auto-Honor-V2_skipHonor")) window.DataStore.set("Auto-Honor-V2_skipHonor", false)

let honored = false

let main = async (type: string) => {
    if (!honored && window.DataStore.get("Auto-Honor-V2") && !window.DataStore.get("Auto-Honor-V2_skipHonor")) {
        honored = true

        log("Start running...")

        await autoHonor.getHonorList()
        await autoHonor.main(window.DataStore.get("Auto-Honor-V2-Mode"), type)

        log("Complete.")
    }
}

let pageListenner = async (node: Element) => {
    const pagename = node.getAttribute("data-screen-name");

    if (pagename === "rcp-fe-lol-champ-select") honored = false
}

let observeHonorScreen = () => {
    upl.observer.subscribeToElementCreation(".vote-ceremony-player-container", async (element: any) => {
        log("Honor screen detected.")

        await main("V1")
    })

    upl.observer.subscribeToElementCreation(".vote-ceremony-v3-player-container", async (element: any) => {
        log("Honor screen V3 detected.")

        await main("V3")
    })

    upl.observer.subscribeToElementCreation(".vote-ceremony-submit-button", async (element: any) => {
        autoHonor.skipHonor(element);
    })

    upl.observer.subscribeToElementCreation(".vote-ceremony-v3-submit-button", async (element: any) => {
        autoHonor.skipHonor(element);
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