const UI = {
    Row: (id, childs) => {
        const row = document.createElement('div')
        row.classList.add('elaina-theme-settings-row')
        row.id = id
        if (Array.isArray(childs)) childs.forEach((el) => row.appendChild(el))
        return row
    },
    Link: (text, href, onClick, ID) => {
        const link = document.createElement('p')
        link.classList.add('lol-settings-code-of-conduct-link')
        link.classList.add('lol-settings-window-size-text')
    
        const a = document.createElement('a')
        a.innerText = text
        a.target = '_blank'
        a.href = href
        a.onclick = onClick || null
        a.download
        a.id = ID || null
    
        link.append(a)
        return link
    },
    CheckBox: (text, ID, boxID, check, show, datastore_name) => {
        const container = document.createElement("div")
        const origin = document.createElement("lol-uikit-flat-checkbox")
        const checkbox = document.createElement("input")
        const label = document.createElement("label")
        const none = document.createElement("div")

        origin.id = ID
        origin.setAttribute("lastDatastore", window.DataStore.get(datastore_name))
    
        checkbox.type = "checkbox"
        checkbox.id = boxID
        if (window.DataStore.get(datastore_name)){
            checkbox.checked = true
            origin.setAttribute("class", "checked")
        }
        else {
            checkbox.checked = false
            origin.setAttribute("class",'')
        }

        checkbox.onclick = () => {
            if (window.DataStore.get(datastore_name)) {
                origin.removeAttribute("class")
                checkbox.checked = false
                window.DataStore.set(datastore_name, false)
                check()
            }
            else {
                origin.setAttribute("class", "checked")
                checkbox.checked = true
                window.DataStore.set(datastore_name, true)
                check()
            }
        }
        checkbox.setAttribute("slot", "input")
    
        label.innerHTML = text
        label.setAttribute("slot", "label")
    
        if (show) {
            container.appendChild(origin)
            origin.appendChild(checkbox)
            origin.appendChild(label)
    
            return container
        }
        else {
            container.appendChild(none)
            return container
        }
    },
    Dropdown: (list,target,text,name,id) => {
        const origin = document.createElement("div")
        const title  = document.createElement("div")
        const dropdown = document.createElement("lol-uikit-framed-dropdown")
    
        origin.classList.add("Dropdown-div")
        title.classList.add("lol-settings-window-size-text")
        title.innerHTML = text
        dropdown.classList.add("lol-settings-general-dropdown")
        origin.append(title,dropdown)
        for (let i = 0; i < list[target].length; i++) {
            const opt = list[target][i]
            const el = document.createElement("lol-uikit-dropdown-option")
            el.setAttribute("slot", "lol-uikit-dropdown-option")
            el.innerText = opt[name]
            el.id = opt[id]
            el.onclick = () => {
                window.DataStore.set(target, opt[id])
            }
            if (window.DataStore.get(target) == opt[id]) {
                el.setAttribute("selected", "true")
            }
            dropdown.appendChild(el)
        }
        return origin
    },
    Label: (text, id) => {
        const label = document.createElement('p')
        label.classList.add('lol-settings-window-size-text')
        label.innerText = text
        label.id = id
        return label
    }
}

export { UI }