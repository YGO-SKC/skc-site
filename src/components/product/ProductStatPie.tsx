import { Typography } from '@mui/material'
import { ResponsivePie } from '@nivo/pie'
import { FC } from 'react'

const ProductStatPie: FC<{ data: any[]; statName: string }> = ({ data, statName }) => {
	const margin = 10
	return (
		<div style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', width: '90%', margin: 'auto', padding: '1rem', borderRadius: '2rem', marginBottom: '1rem' }}>
			<Typography style={{ color: 'white' }} variant='h2' align='center'>
				{statName}
			</Typography>
			<br />

			<div style={{ height: '250px', width: '100%' }}>
				<ResponsivePie
					margin={{ top: margin, right: margin * 5, bottom: margin, left: margin }}
					data={data}
					animate={true}
					activeOuterRadiusOffset={4}
					innerRadius={0}
					arcLabelsRadiusOffset={0.6}
					activeInnerRadiusOffset={0}
					// arcLinkLabelsDiagonalLength={30}
					// arcLinkLabelsStraightLength={20}
					// arcLinkLabelsTextOffset={10}
					// arcLinkLabelsTextColor='inherit'
					layers={['arcs', 'legends', 'arcLabels']}
					colors={{ scheme: 'pastel2' }}
					theme={{
						fontSize: 14,
						fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
					}}
					legends={[
						{
							anchor: 'bottom-right',
							direction: 'column',
							justify: false,
							translateX: margin * 5,
							translateY: -10,
							itemsSpacing: 0,
							itemWidth: 100,
							itemHeight: 20,
							itemTextColor: 'white',
							itemDirection: 'right-to-left',
							itemOpacity: 1,
							symbolSize: 10,
							symbolShape: 'circle',
						},
					]}
				/>
			</div>
		</div>
	)
}

export default ProductStatPie
