export function toMap<V>(dict: {[k: string] : V}): Map<string, V>{
    let map = new Map<string, V>()
    for (let [k,v] of Object.entries(dict)) {
        map.set(k,v)
    }
    return map
}
