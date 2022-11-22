import { Chip } from '@mui/material'
import { FC } from 'react'

export type _BanListDiffSpreadNormalFormat = {
	numNewForbidden: number
	numNewLimited: number
	numNewSemiLimited: number
	numRemoved: number
}

const BanListDiffSpreadNormalFormat: FC<_BanListDiffSpreadNormalFormat> = ({ numNewForbidden, numNewLimited, numNewSemiLimited, numRemoved }) => {
	return (
		<div style={{ width: '100%' }}>
			<Chip className='breakdown-chip forbidden-breakdown-chip' variant='outlined' label={`${numNewForbidden} New Forbidden`} />
			<Chip className='breakdown-chip limited-breakdown-chip' variant='outlined' label={`${numNewLimited} New Limited`} />
			<Chip className='breakdown-chip semi-limited-breakdown-chip' variant='outlined' label={`${numNewSemiLimited} New Semi Limited`} />
			<Chip className='breakdown-chip removed-breakdown-chip' variant='outlined' label={`${numRemoved} New Unlimited`} />
		</div>
	)
}

export default BanListDiffSpreadNormalFormat