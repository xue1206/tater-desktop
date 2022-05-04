function getHost(url: string) {
  return new URL(url).host
}

function getGoogleFaviconUrl(host: string) {
  // return `https://www.google.com/s2/favicons?domain=${decodeURIComponent(host)}&sz=128`
  return `https://icon.horse/icon/${decodeURIComponent(host)}`
}

class Site {
  name: string
  url: string
  tagStr: string
  iconUrl: string
  constructor(name: string, url: string, tagStr: string) {
    this.name = name
    this.url = url
    this.tagStr = tagStr
    this.iconUrl = getGoogleFaviconUrl(getHost(url))
  }
  get tags() {
    return this.tagStr.split(",")
  }
}

export default Site
