import { useEffect, useState, lazy } from 'react'

import YouTubeUploads from '../util/social/YouTubeUploads'
import {HEART_API_HOST_NAME} from '../../helper/DownstreamServices'

import { handleFetch } from '../../helper/FetchHandler'

const GenericNonBreakingErr = lazy(() => import('../util/exception/GenericNonBreakingErr'))


export default function YouTubeData() {
	const [youtubeData, setYoutubeData] = useState(undefined)
	const [errFetchingData, setErrFetchingData] = useState(false)

	useEffect(() => {
		handleFetch(`${HEART_API_HOST_NAME}/api/v1/yt/channel/uploads?channelId=UCBZ_1wWyLQI3SV9IgLbyiNQ`, json => {
			setYoutubeData(json)
		}, false)
		?.catch(_err => {
			setErrFetchingData(true)
		})
	}, [])

	return(
		<div style={{maxWidth: '100%', background: '#FAFAFA', paddingLeft: '.8rem', paddingRight: '.8rem', paddingTop: '1.5rem', paddingBottom: '1.5rem', borderBottomLeftRadius: '2rem', borderBottomRightRadius: '2rem' }} >
			{
				(errFetchingData)?
					<GenericNonBreakingErr
						errExplanation='No meaningful impact to the site functionality expected. Come back at a different time to see recent YouTube uploads 🎥!' />
					:<YouTubeUploads youtubeData={youtubeData} />
			}

		</div>
	)
}