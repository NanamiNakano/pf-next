const fs = require("fs")
const path = require("path")

const baseLangPath = path.join(process.cwd(), "locales", "zh-CN.json")
const otherLangPaths = ["en-GB.json"].map(lang => path.join(process.cwd(), "locales", lang))

function addMissingKeys(base, target) {
  for (const key in base) {
    if (base[key]) {
      if (typeof base[key] === "object" && base[key] !== null) {
        if (!target[key]) {
          target[key] = {}
        }
        addMissingKeys(base[key], target[key])
      }
      else {
        if (!target[key]) {
          target[key] = ""
        }
      }
    }
  }
  for (const key in target) {
    if (target[key] && !base[key]) {
      delete target[key]
    }
  }
}

function syncLanguageFiles(baseLangPath, otherLangPaths) {
  const baseData = JSON.parse(fs.readFileSync(baseLangPath, "utf-8"))

  otherLangPaths.forEach((langPath) => {
    const langData = JSON.parse(fs.readFileSync(langPath, "utf-8"))

    addMissingKeys(baseData, langData)

    fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), "utf-8")
  })
}

syncLanguageFiles(baseLangPath, otherLangPaths)
console.log("Language files synchronized successfully.")
