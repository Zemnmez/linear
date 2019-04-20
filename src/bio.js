import bio from '@zemnmez/bio';

const parseDates = (data) => {
  data.timeline = data.timeline.map(({date, ...etc}) => {
    date = parseSimpleDate(date);

    return ({date, ...etc});
  });

  return data;
}

const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const parseSimpleDate = (date) => {
    let [month, day, year] = date.split(" ");
    month = months.indexOf(month);

    if (month === -1) throw Error(`invalid date ${date}`);

    return new Date(year, month, day);
}

const newBio = parseDates(bio);

export default newBio;
