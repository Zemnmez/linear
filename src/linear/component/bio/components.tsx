import Timeline from 'linear/component/bio/Timeline';
import * as bio from 'linear/bio';
import { Month, Month } from 'linear/page/Home/Timeline';

/**
 * Takes a timeline and turns it into a nested
 * object of years and months
 */
export const CollateSortedTimeline:
    (t: bio.Timeline) => Pick<Timeline, 'years'>
=
    timeline => {
        type Year = number;
        type Month = number;

        const eventsByYear = new DupeMap<Year, bio.Event>()
        eventsByYear.add(...timeline.map<[Year, bio.Event]>(
            e => [e.date.getFullYear(), e]
        ));

        const yearsMaps: DupeMap<Year, DupeMap<Month, bio.Event>> =
            new DupeMap<Month, DupeMap<Month, bio.Event>>().add(...[...eventsByYear].map<[Year, DupeMap<Month, bio.Event>]>(([year, months]) =>
                [year, new DupeMap<Month, bio.Event>().add(...months.map<[Month, bio.Event]>(
                    e => [e.date.getMonth(), e]
                ))]
            ));

        interface oMonth {
            month: Month,
            events: bio.Event[]
        }

        interface oYear {
            year: Year
            months: oMonth[]
        }

        interface oTimeline {
            years: oYear[]
        }

        new DupeMap([...yearsMaps].map(([year,months]) =>
            [year, { year, months: months.map(month =>)}] 
        );

        /*
        const years = [...yearMonths].map(
            ([year, months]) => ({
                year,
                months: [...months].map(
                    ([month, events]) => ({
                        month,
                        events
                    })
                )
            })
        );
        */

        return { years };
    }
;

type KV<K, V> = [K,V];

class RecordMap<K extends string | number | symbol,V> extends Map<K,V> {
    public toRecord(): Record<K,V> {
        let o: Record<K,V> = {} as any;

        for (let [k,v] of this) o[k] = v;

        return o;
    }
}

/**
 * DupeMap of K, V represents a Map<K,V[]>
 * where a .add() will ADD a value to the
 * V[] rather than replacing it.
 */
class DupeMap<K extends string | number | symbol,V> extends RecordMap<K,V[]> {
    public add(...etc: [K,V][]) {
        for (let [k, v] of etc) this.set(
            k,
            [
                ...this.get(k) || [],
                v
            ]
        );

        return this;
    }
}