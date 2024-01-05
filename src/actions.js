import { save, open } from './editor'
export const actions = {
    "file.download": () => {
        save()
    },
    "file.upload": async () => {
        await open()
    },
    "file.exit": () => {
        if (confirm("Close window?")) {
            window.open('about:blank','_self').close()
        }
    }
}