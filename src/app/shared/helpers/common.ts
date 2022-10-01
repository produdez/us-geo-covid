import { CustomDate } from "../models/customDate"

export function toMap<V>(dict: {[k: string] : V}): Map<string, V>{
    let map = new Map<string, V>()
    for (let [k,v] of Object.entries(dict)) {
        map.set(k,v)
    }
    return map
}

export function addTime (date: Date, range: number, type?: string) {
    const newDate = new CustomDate(date)
    if (type === 'year') newDate.setFullYear(newDate.getFullYear() + range)
    else if (type === 'month') newDate.setMonth(newDate.getMonth() + range)
    else newDate.setDate(newDate.getDate() + range)
    
    return newDate
}

export function formatDate(date: Date): string {
    return date.toLocaleDateString("en-GB")
}
