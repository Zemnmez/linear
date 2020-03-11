import pathGen, * as t from '.';
import { withKnobs } from "@storybook/addon-knobs";
import * as svg from '../svg';
import { Knobs } from 'linear/component/defaults_knobs';
export default { title: 'hourglass', decorators: [withKnobs] }

export const Hourglass = Knobs(svg.PathSVG(pathGen), t.HourglassProps)