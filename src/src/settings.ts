import { UI } from "./settingsUI.ts"
import { log } from "./log.ts"
import * as upl from "pengu-upl"

class Settings {
    data: { 
        groupName: string; 
        titleKey: string; 
        titleName: string; 
        capitalTitleKey: string; 
        capitalTitleName: string; 
        element: { 
            name: string; 
            title: string; 
            titleName: string; 
            class: string; 
            id: string 
        }[] 
    }[]
    
    constructor () {
        this.data = [
            {
                "groupName": 'auto-honor-v2',
                "titleKey": 'el_auto-honor-v2',
                "titleName": 'Auto Honor V2',
                "capitalTitleKey": 'el_auto-honor-v2_capital',
                "capitalTitleName": 'AUTO HONOR V2',
                "element": [
                    {
                        "name": "auto-honor-v2-settings",
                        "title": "el_auto-honor-v2-settings",
                        "titleName": "SETTINGS",
                        "class": "auto-honor-v2-settings",
                        "id": "auto-honor-v2-settings",
                    },
                ],
            },
        ]
    }

    settingsUI = (panel: any) => {
        let option = {
            "Auto-Honor-V2-Mode": [
                {
                    "id": 0,
                    "type": "Allies"
                },
                {
                    "id": 1,
                    "type": "Enermy"
                },
                {
                    "id": 2,
                    "type": "All"
                },
            ]
        }

        panel.prepend(
            UI.Row("",[
                UI.Row("Info",[
                    UI.Row("Info-div",[
                        UI.Link(
                            'Auto Honor V2',
                            'https://github.com/Elaina69/Elaina-V4',
                            () => {},""
                        )
                    ]),
                ]),
                UI.CheckBox("Auto honor players", "autohv2", "autohv2box", () => {}, true, "Auto-Honor-V2"),
                document.createElement('br'),
                UI.Dropdown(option, "Auto-Honor-V2-Mode", "Auto honor list", "type", "id"),
                document.createElement('br'),
                UI.Label("", "auto-honor-v2-warning_1")
            ])
        )
    }

    injectSettingsUI = () => {
        let check: number
        const interval = setInterval(() => {
            const manager = document.getElementById('lol-uikit-layer-manager-wrapper')
            
            if (manager) {
                clearInterval(interval)
                new MutationObserver((mutations) => {
                    const plugin = document.querySelector('lol-uikit-scrollable.auto-honor-v2-settings')

                    if (plugin && mutations.some((record) => Array.from(record.addedNodes).includes(plugin))) {
                        this.settingsUI(plugin)
                    }
                }).observe(manager, {
                    childList: true,
                    subtree: true
                })
            }9999
        },500)

        upl.observer.subscribeToElementCreation("#auto-honor-v2-warning_1", (element: any) => {
            check = window.setInterval(() => {
                if (window.DataStore.get("Auto-Honor-V2-Mode") == 2) {
                    element.style.color = "red"
                    element.textContent = "It may not auto close the honor screen, use at your own risk."
                }
                else {
                    element.textContent = ""
                }
            })
        })

        upl.observer.subscribeToElementDeletion("#auto-honor-v2-warning_1", (element: any) => {
            window.clearInterval(check)
            log("Interval cleared")
        })
    }
}
let settings = new Settings()

export { settings }