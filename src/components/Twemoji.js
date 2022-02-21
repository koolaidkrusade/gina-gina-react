import { memo } from 'react'
import twemoji from 'twemoji'

const Twemoji = ({emoji}) => (
	<div className='twemoji'
		dangerouslySetInnerHTML={{
			__html: twemoji.parse(emoji, {
			folder: 'svg',
			ext: '.svg'
			})
		}}
    />
)

export default memo(Twemoji)