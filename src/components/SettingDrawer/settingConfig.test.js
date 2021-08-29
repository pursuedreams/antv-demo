const settingConfig = require("./settingConfig")
// @ponicode
describe("settingConfig.updateTheme", () => {
    test("0", () => {
        let callFunction = () => {
            settingConfig.updateTheme(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            settingConfig.updateTheme(-100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            settingConfig.updateTheme(0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            settingConfig.updateTheme(100)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            settingConfig.updateTheme(-5.48)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            settingConfig.updateTheme(-Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})
