import { SimpleDate, Parse as ParseSimpleDate } from 'linear/time/simpledate';
import { Upgrade } from 'linear/util';
import { KV } from 'linear/higher';

export interface BioJson {
    bio: string,
    birthdate: SimpleDate,
    employment: EmploymentJson[],
    skills: string[],
    links: Record<string, string>,
    timeline: JsonEvent[]
    who: Who
}

export type Bio = Upgrade<BioJson, {
    birthdate: Date,
    timeline: Timeline,
    links: KV<string, URL>,
    employment: Employment[]
}>

export type Timeline = Event[];

export interface Who {
    handle: string,
    name: string[]
}


export interface EmploymentJson {
    since: SimpleDate,
    title: string,
    where: string
}

export type Employment = Upgrade<EmploymentJson,{
    since: Date
}>

export const Employment:
    (v: EmploymentJson) => Employment
=
    ({ since, ...etc }) => ({
        since: ParseSimpleDate(since),
        ...etc
    })
;

export interface JsonEvent {
    date: SimpleDate,
    description?: string,
    tags?: string[],
    title: string,
    url?: string,
    priority?: number,
    duration?: string | "ongoing"
}

export type Event = Upgrade<JsonEvent,{
    date: Date,
    url?: URL
}>


export const ParseBio:
    (b: BioJson) => Bio
=
    ({birthdate, timeline, links, employment, ...etc}) => ({
        birthdate: ParseSimpleDate(birthdate),
        timeline: Timeline(timeline),
        employment: employment.map(Employment),
        links: new Map(Object.entries(links).map(([k,v]) =>
            [k, new URL(v)])),
        ...etc
    })
;

export const Timeline:
    (t: JsonEvent[]) => Event[]
=
    t => t.map(Event).sort(
        ({ date: A }, { date: B }) => (+A) - (+B)
    )
;

const Event:
    (e: JsonEvent) => Event
=
    ({ date, url, ...etc }) => ({
        date: ParseSimpleDate(date),
        url: url === undefined? url: new URL(url),
        ...etc
    })
;

export const Bio = ParseBio({
    "bio": "security engineer with strong skills in the Go programming language and the design of robust modern application security architectures",
    "birthdate": [17, "may", 1994],
    "employment": [
        {
            "since": ['sep', 2014],
            "title": "Information Security Engineer",
            "where": "Twitch"
        },
        {
            "since": ['may', 2018],
            "title": "Application Security Engineer",
            "where": "UKNCSC"
        }
    ],
    "links": {
        "linkedin": "https://www.linkedin.com/in/thomas-shadwell-4b333b50",
        "github": "https://github.com/zemnmez",
        "twitch": "https://twitch.tv/zemnmez",
        "twitter": "https://twitter.com/zemnmez"
    },
    "skills": [
        "Go",
        "Python",
        "Javascript",
        "React",
        "d3",
        "Bash",
        "Ruby",
        "appsec arch",
        "electron",
        "AWS",
        "pentesting",
        "code review",
        "cryptography",
        "reversing"
    ],
    "timeline": [
        {
            date: [11, 'jul', 2019],
            title: "National Cyber Security Centre 'Turing' challenge coin",
            priority: 5,
            tags: [ 'accolade' ],
            url: "https://twitter.com/zemnmez/status/1149278890969456640",
            description: "award for my work on UK government vulnerability disclosure policy and my responsible disclosure of vulnerabilities in the UK tax system."
        },
        {
            "date": [20, 'jan', 2019],
            "description": "hybrid ctf / esports competition winners",
            "priority": 6,
            "tags": [
                "accolade",
                "security",
                "gaming"
            ],
            "title": "hack fortress 2019 champions",
            "url": "https://twitter.com/tf2shmoo/status/1086785642514796544"
        },
        {
            "date": [14, 'jan', 2019],
            "description": "react helper bindings for d3",
            "priority": 6,
            "tags": [
                "software",
                "library",
                "d3",
                "react"
            ],
            "title": "reactive-d3",
            "url": "https://github.com/Zemnmez/reactive-d3"
        },
        {
            "date": [7, 'jan', 2019],
            "description": "react based personal website for 2019",
            "priority": 6,
            "tags": [
                "software",
                "react"
            ],
            "title": "linear",
            "url": "https://github.com/Zemnmez/linear"
        },
        {
            "date": [8, 'jan', 2019],
            "description": "news coverage of steam rce",
            "priority": 7,
            "tags": [
                "security",
                "disclosure",
                "comment"
            ],
            "title": "$7,500 Steam Weakness Let Hackers Take Remote Control Of Gamers' PCs",
            "url": "https://www.forbes.com/sites/thomasbrewster/2019/01/08/7500-steam-weakness-let-hackers-take-remote-control-of-gamers-pcs"
        },
        {
            "date": [12, 'aug', 2019],
            "priority": 6,
            "tags": [
                "security",
                "gaming",
                "accolade"
            ],
            "title": "hack fortress DEFCON 2018 winners",
            "url": "https://twitter.com/tf2shmoo/status/1028462663368507392"
        },
        {
            "date": [7, 'jan', 2019],
            "description": "vulnerability to remotely access Steam users' computers",
            "priority": 8,
            "tags": [
                "gaming",
                "security",
                "accolade"
            ],
            "title": "Steam Remote Code Execution",
            "url": "https://hackerone.com/reports/409850"
        },
        {
            "date": [15, 'dec', 2018],
            "description": "Quick article on the security of modern desktop web applications",
            "priority": 7,
            "tags": [
                "security"
            ],
            "title": "\u00dcbersicht Remote Code Execution, Spotify takeover",
            "url": "https://medium.com/@Zemnmez/%C3%BCbersicht-remote-code-execution-spotify-takeover-a5f6fd6809d0"
        },
        {
            "date": [22, 'jan', 2018],
            "priority": 8,
            "tags": [
                "gaming",
                "security",
                "accolade"
            ],
            "title": "forbes 30 under 30, tech",
            "url": "https://www.forbes.com/profile/thomas-shadwell",
            "description": "for my work at Twitch, and on responsible disclosure"
        },
        {
            "date": [22, 'jan', 2018],
            "description": "advisory position. Provided expertise to UK cyber advisory / defence group on Go and building security analysis systems",
            "duration": "ongoing",
            "priority": 8,
            "tags": [
                "security",
                "work"
            ],
            "title": "Application Security Engineer, UK National Cyber Security Centre"
        },
        {
            "date": [23, 'nov', 2017],
            "description": "talk at owasp about critical uk tax system flaw in obfuscated system and the 57 day trek to get it fixed",
            "priority": 6,
            "tags": [
                "security",
                "talk",
                "writing"
            ],
            "title": "how to hack the uk tax system: the talk",
            "url": "https://twitter.com/zemnmez/status/933847040198574080"
        },
        {
            "date": [8, 'sep', 2017],
            "description": "news post on manipulation of UK tax data",
            "priority": 6,
            "tags": [
                "security",
                "disclosure",
                "comment"
            ],
            "title": "'Serious' security flaws found on official UK tax site",
            "url": "http://www.bbc.co.uk/news/technology-41188008"
        },
        {
            "date": [25, 'jan', 2016],
            "description": "unauthorized remote shutdown of Buffalo-made network attached storage devices",
            "priority": 6,
            "tags": [
                "security",
                "writing",
                "disclosure"
            ],
            "title": "Buffalo NAS Remote Shutdown",
            "url": "https://packetstormsecurity.com/files/135368"
        },
        {
            "date": [1, 'may', 2012],
            "description": "full stack freelance work building MVPs for London startups and wrangling data for hackathons",
            "duration": "2 years",
            "priority": 7,
            "tags": [
                "work"
            ],
            "title": "Software Engineer, Consultant"
        },
        {
            "date": [16, 'may', 2016],
            "description": "code execution in official Mr Robot site",
            "priority": 7,
            "tags": [
                "security",
                "disclosure",
                "comment"
            ],
            "title": "'Mr. Robot' Web Weaknesses Left Fans And USA Network Vulnerable, Warns Non-Fictional Hacker",
            "url": "https://www.forbes.com/sites/thomasbrewster/2016/05/16/mr-robot-imagetragick-usa-network-wide-open-to-hackers/#7d49f6f66d77"
        },
        {
            "date": [11, 'may', 2016],
            "description": "XSS in Mr Robot official site",
            "priority": 6,
            "tags": [
                "security",
                "disclosure",
                "comment"
            ],
            "title": "Irony Alert: Hacker Finds Vulnerability In Mr Robot Website",
            "url": "https://www.forbes.com/sites/thomasbrewster/2016/05/11/flaw-in-mr-robot-website-allowed-facebook-attack/#747437ef6bed"
        },
        {
            "date": [8, 'sep', 2017],
            "description": "vulnerability allowing manipulation of UK tax system",
            "priority": 8,
            "tags": [
                "security",
                "writing",
                "disclosure"
            ],
            "title": "how to hack the uk tax system, i guess",
            "url": "https://medium.com/@Zemnmez/how-to-hack-the-uk-tax-system-i-guess-3e84b70f8b"
        },
        {
            "date": [18, 'feb', 2017],
            "description": "musings on the evolution of design",
            "tags": [
                "writing"
            ],
            "title": "Design Evolves By Constraint",
            "url": "https://medium.com/@Zemnmez/design-evolves-by-constraint-f2d87697d25e"
        },
        {
            "date": [3, 'jan', 2016],
            "description": "minimal reactive d3.js resistor colour code calculator",
            "priority": 6,
            "tags": [
                "software"
            ],
            "title": "r.no.ms",
            "url": "http://r.no.ms"
        },
        {
            "date": [27, 'apr', 2016],
            "description": "padding oracle based decryption of Steam traffic",
            "priority": 7,
            "tags": [
                "security",
                "gaming",
                "disclosure"
            ],
            "title": "steam patches broken crypto in wake of replay, padding oracle attacks",
            "url": "https://threatpost.com/steam-patches-broken-crypto-in-wake-of-replay-padding-oracle-attacks/117691/"
        },
        {
            "date": [7, 'jul', 2014],
            "description": "exploit using content security policy 1 to steal data on the web",
            "priority": 9,
            "tags": [
                "security",
                "writing",
                "disclosure"
            ],
            "title": "when security creates insecurity",
            "url": "http://archive.is/UXD8j"
        },
        {
            "date": [4, "jul", 2017],
            "description": "musings on go-specific security gotchas",
            "priority": 5,
            "tags": [
                "security",
                "talk"
            ],
            "title": "This Will Cut You: Go's Sharper Edges",
            "url": "https://www.infoq.com/presentations/go-security"
        },
        {
            "date": [1, 'sep', 2011],
            "description": "Volunteer role at once largest trading website in the Steam community. Worked on administration of high-profile trades & scams",
            "duration": "3 years",
            "priority": 5,
            "tags": [
                "work",
                "gaming"
            ],
            "title": "Sr. Admin, TF2Outpost"
        },
        {
            "date": [24, 'jan', 2016],
            "description": "Host based account hijack attack on php-openid",
            "priority": 6,
            "tags": [
                "security",
                "writing",
                "disclosure"
            ],
            "title": "CVE-2016-2049",
            "url": "https://cve.mitre.org/cgi-bin/cvetitle.cgi?title:CVE-2016-2049"
        },
        {
            "date": [14, 'dec', 2015],
            "description": "unique developer granted cosmetic item for the video game Team Fortress 2 granted for security issue allowing decryption of all Steam traffic",
            "priority": 6.5,
            "tags": [
                "gaming",
                "security",
                "accolade"
            ],
            "title": "Burning Flames Finder\u2019s Fee",
            "url": "http://steamcommunity.com/id/both/inventory/#440_2_4398163918"
        },
        {
            "date": [19, 'oct', 2015],
            "description": "unique developer granted cosmetic item for the video game Team Fortress 2 granted for security issues allowing remote access to computers running the video game",
            "priority": 7,
            "tags": [
                "gaming",
                "security",
                "accolade"
            ],
            "title": "Nebula Finder\u2019s Fee",
            "url": "http://steamcommunity.com/id/both/inventory/#440_2_4228772424"
        },
        {
            "date": [22, 'apr', 2014],
            "description": "unique developer granted cosmetic item for the video game Team Fortress 2 granted for security issues allowing movement millions of dollars of virtual items between arbitrary accounts via account takeover",
            "priority": 6.5,
            "tags": [
                "gaming",
                "security",
                "accolade"
            ],
            "title": "Sunbeams Ebenezer",
            "url": "http://steamcommunity.com/id/both/inventory/#440_2_4818206214"
        },
        {
            "date": [1, 'feb', 2011],
            "description": "Young Rewired State 2011",
            "priority": 5,
            "tags": [
                "software",
                "accolade"
            ],
            "title": "Best example of Coding",
            "url": "https://web.archive.org/web/20120306190316/http://youngrewiredstate.org/2011-08/cant-vote-but-can-put-a-wind-in-governments-sails/"
        },
        {
            "date": [5, 'aug', 2011],
            "description": "Rewired State: Parliament",
            "priority": 5,
            "tags": [
                "software",
                "accolade"
            ],
            "title": "Better understanding of the work of Parliament Prize",
            "url": "https://web.archive.org/web/20121105174535/http://rewiredstate.org:80/blog/2011/11/press-release-for-rewired-state-parliament"
        },
        {
            "date": [1, 'apr', 2011],
            "description": "London Real Time Hackathon",
            "priority": 5,
            "tags": [
                "software",
                "accolade"
            ],
            "title": "Geckoboard Prize",
            "url": "https://web.archive.org/web/20121113024249/http://Londonrealtime.co.uk/"
        },
        {
            "date": [1, 'apr', 2011],
            "description": "National Hack the Government Day 2011",
            "priority": 5,
            "tags": [
                "software",
                "accolade"
            ],
            "title": "Wallace and Gromit Prize",
            "url": "https://www.theguardian.com/info/developer-blog/2011/apr/05/national-hack-the-government-day-2011"
        },
        {
            "date": [1, 'jan', 2013],
            "description": "international chemistry challenge",
            "priority": 6,
            "tags": [
                "science",
                "accolade"
            ],
            "title": "7th place Cambridge Chemistry Challenge (C3L6)"
        },
        {
            "date": [1, 'jan', 2014],
            "description": "international chemistry challenge",
            "priority": 5,
            "tags": [
                "science",
                "accolade"
            ],
            "title": "5th place, Cambridge Chemistry Challenge (C3L6)"
        },
        {
            "date":[8, 'nov', 2011],
            "description": "Interview on National Hack the Government Day prize (dutch)",
            "priority": 5,
            "tags": [
                "software",
                "comment"
            ],
            "title": "MozFest: Rewired State geeft jonge programmeurs een kans",
            "url": "http://www.denieuwereporter.nl/2011/11/mozfest-rewired-state-geeft-jonge-programmeurs-een-kans/"
        },
        {
            "date": [1, 'sep', 2014],
            "description": "first security engineer at the video game streaming website. Designed security architecture for flagship projects including bits, the Twitch API, extensions and Twitch's OIDC / OAuth AuthN/Z systems. Created and defined security relationships and processes. Built Go security static analysis system, security frameworks and libraries",
            "duration": "ongoing",
            "priority": 9,
            "tags": [
                "software",
                "security",
                "work"
            ],
            "title": "Security Engineer, Twitch",
            "url": "https://twitch.tv"
        },
        {
            "date": [1, 'mar', 2012],
            "description": "charity focused on teaching code literacy. Ran and participated in hackathons for good causes. Taught software engineering to young people",
            "duration": "3 years",
            "priority": 6,
            "tags": [
                "software",
                "security",
                "work"
            ],
            "title": "Developer, Rewired State"
        }
    ],
    "who": {
        "handle": "zemnmez",
        "name": [
            "thomas",
            "neil",
            "james",
            "shadwell"
        ]
    }
})