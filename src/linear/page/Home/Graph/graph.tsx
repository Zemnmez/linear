import { Event, Timeline } from 'linear/bio';
import { classes } from 'linear/dom/classes'
import React from 'react';
import { ScaleTime, scaleTime, scaleBand, ScaleBand } from 'd3-scale';
import { axisLeft, axisBottom, AxisDomain, Axis as AxisT } from 'd3-axis';
import { select } from 'd3-selection';
import style from './graph.module.css';
import { useResizeObserver } from 'linear/hook/useResizeObserver';

type XUnits = Date;
type YUnits = string; // (categeory)
type XScale = ScaleTime<number, number>;
type YScale = ScaleBand<string>;


interface PipProps extends Event {
    XScale: XScale
    YScale: YScale
    tags: string[]
    x?: number, y?: number
}

interface Placeable {
    x: number, y: number
}

interface Sizable {
    width: number, height: number
}

interface AxisProps<D extends AxisDomain> extends Placeable {
    axis: AxisT<D>;
    size?: (size: Sizable) => void
}



/**
 * Renders the given scale to an axis.
 */
const Axis:
    <D extends AxisDomain>(s: AxisProps<D>) => React.ReactElement
=
    ({ axis: gen, x, y, size }) => {

        const refCallback = React.useCallback(
            (elem: SVGSVGElement) => {
                gen(select(elem));
                if ( size && elem ) size(elem.getBBox())
            }
        , [ gen ]);

        return <g className={style.Axis} ref={refCallback}
            transform={`translate(${x} ${y})`}/>
    }
;


/**
 * Plots the vertical pips for an event
 */
const EventPips:
    (e: PipProps) => React.ReactElement
=
    ({ XScale, YScale, date, tags, x = 0, y = 0 }) =>
        <> {tags.map((tag, key) => <EventPip {...{
            date, tag, XScale, YScale, dx: x, dy: y, key
        }}/>)} </>
;

interface EventPipProps {
    date: Date
    tag: string
    XScale: XScale
    YScale: YScale
    dx: number
    dy: number
}

const EventPip:
    (p: EventPipProps) => React.ReactElement
=
    ({ date, tag, XScale, YScale, dx, dy }) => {
        const [x, y] = [
            XScale(date) + dx,
            (YScale(tag)??0) + dy
        ];

        const [width, height] = [
            1,
            YScale.bandwidth()
        ]

        return <rect {...{
            x, y,
            width, height
        }}/>
    }
;



interface TimelineData {
    tags: Set<string>
    firstDate: Date
    lastDate: Date
}

const analysis:
    (timeline: Timeline) => TimelineData
=
    timeline => {
        const seenTags = new Set<string>();
        let firstDate: Date | undefined;
        let lastDate: Date | undefined;
        for (const { date, tags } of timeline) {
            if (!firstDate) firstDate = date;
            tags?.forEach(tag => seenTags.add(tag));
            lastDate = date;
        }

        if (!(firstDate || lastDate))
            throw new Error("no records");

        return ({
            tags: seenTags,
            firstDate: firstDate as Date,
            lastDate: lastDate as Date
        })
    }
;

export interface GraphProps extends Omit<GraphChildrenProps, keyof Sizable> {
    className?: string
    style?: React.HTMLAttributes<HTMLDivElement>["style"]
}

export const Graph:
    (p: GraphProps) => React.ReactElement
=
    ({ className, style: css, ...etc }) => {
        const { wh: d, ref } = useResizeObserver();

        return <div {...{
            ...classes(style.Graph, className),
            style: css,
            ref
        }}>
            {d?<GraphChildren {...{
                width: d[0],
                height: d[1],
                ...etc
            }}/>:<></>}

        </div>

    }
;


interface GraphChildrenProps extends Sizable {
    padding?: number,
    timeline: Timeline
}

const nilSizable = { width: 0, height: 0};

const GraphChildren:
    (props: GraphChildrenProps) => React.ReactElement
=
    ({ timeline, width, height, padding = 60 }) => {

        const [XAxisSize, setXAxisSize] = React.useState<Sizable>(nilSizable);
        const [YAxisSize, setYAxisSize] = React.useState<Sizable>(nilSizable);

        const canvasWidth = width - YAxisSize.width - (padding);
        const canvasHeight = height - XAxisSize.height - (padding);

        const { tags, firstDate, lastDate } = React.useMemo(
            () => analysis(timeline)
        , [ timeline ]);


        const XScale: XScale = React.useMemo(
            () => scaleTime<number>()
                .domain([ firstDate, lastDate ])
                .range([ 0, canvasWidth])
        , [ firstDate, lastDate, canvasWidth ])

        const YScale = React.useMemo(
            () => scaleBand<string>()
                .domain([...tags])
                .range([0, canvasHeight])
        , [ tags, canvasHeight ]);

        const XAxis = React.useMemo(
            () => axisBottom(XScale)
        , [ XScale ]);

        const YAxis = React.useMemo(
            () => axisLeft(YScale)
        , [ YScale ]);


        return <svg {...{
                    viewBox: `0 0 ${width} ${height}`
                }}>

            <Axis axis={XAxis} x={padding} y={canvasHeight}
                size={setXAxisSize}
            />
            <Axis axis={YAxis} x={padding} y={0}
                size={setYAxisSize}
            />
            {timeline.map(({ tags, ...etc }, key) =>
                tags?<EventPips {...{
                    XScale,
                    YScale,
                    tags,
                    key,
                    x: padding,
                    y: 0,
                    ...etc,
                }}/>:<></>)}

        </svg>
    }
;

export default Graph;