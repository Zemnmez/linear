import * as bio from 'linear/bio';
import React from 'react';
import style from 'linear/component/bio/style'
import * as dom from 'linear/dom';
import * as link from 'linear/dom/Link';
import * as guard from 'linear/higher/guard';

export type Title = Pick<bio.Event, 'title' | 'url'>;
export type TitleProps = Title;
export const Title:
    React.FC<Title>
=
    ({ title, url }) => <header {...{
        className: style.Title,
    }}>
        <link.Link {...{
            url: url?guard.must(dom.isHTTPURL)(url):url
        }}>
            {title}
        </link.Link>
    </header>
;

export default Title;

