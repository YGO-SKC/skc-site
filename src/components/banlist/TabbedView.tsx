import { useState, useEffect, memo, FC } from 'react'
import styled from 'styled-components'
import { AppBar, Tabs, Tab } from '@mui/material'
import BlockIcon from '@mui/icons-material/Block'
import LooksOneTwoToneIcon from '@mui/icons-material/LooksOneTwoTone'
import LooksTwoTwoToneIcon from '@mui/icons-material/LooksTwoTwoTone'

import { TabPanel } from './TabPanel'

const CustomTabs = styled(Tabs)`
	&& {
		margin: auto;
		.MuiTab-textColorPrimary.Mui-selected {
			font-weight: 900;
			color: black;
		}
	}
`

const StyledAppBar = styled(AppBar)`
	&& {
		background-color: rgba(255, 255, 255, 0.7) !important;
		backdrop-filter: blur(60px);
	}
`

type _TabbedView = {
	numForbidden: number
	numLimited: number
	numSemiLimited: number
	forbiddenContent: JSX.Element
	limitedContent: JSX.Element
	semiLimitedContent: JSX.Element
}

const TabbedView: FC<_TabbedView> = memo(
	({ numForbidden, numLimited, numSemiLimited, forbiddenContent, limitedContent, semiLimitedContent }) => {
		const [currentTab, setCurrentTab] = useState(0)
		const [tabs, setTabs] = useState<JSX.Element[]>([])

		useEffect(() => {
			const tabs = []
			tabs.push(
				<Tab
					key='forbidden'
					style={{ textTransform: 'none' }}
					icon={<BlockIcon color='error' style={{ fontSize: '1.8rem' }} />}
					label={`Forbidden (${numForbidden})`}
					{...allyProps(0)}
				/>
			)

			tabs.push(
				<Tab
					key='limited'
					style={{ textTransform: 'none' }}
					icon={<LooksOneTwoToneIcon style={{ color: '#ff9100', fontSize: '1.8rem' }} />}
					label={`Limited (${numLimited})`}
					{...allyProps(1)}
				/>
			)

			tabs.push(
				<Tab
					key='semiLimited'
					style={{ textTransform: 'none' }}
					icon={<LooksTwoTwoToneIcon style={{ color: '#4caf50', fontSize: '1.8rem' }} />}
					label={`Semi-Limited (${numSemiLimited})`}
					{...allyProps(2)}
				/>
			)

			setTabs(tabs)
		}, [numForbidden, numLimited, numSemiLimited])

		return (
			<div>
				<StyledAppBar style={{ boxShadow: 'none' }} position='sticky'>
					<CustomTabs
						textColor='primary'
						value={currentTab}
						onChange={(_event, newValue: number) => {
							setCurrentTab(newValue)
						}}
						variant='standard'
					>
						{tabs}
					</CustomTabs>
				</StyledAppBar>

				<TabPanel value={currentTab} index={0}>
					{forbiddenContent}
				</TabPanel>

				<TabPanel value={currentTab} index={1}>
					{limitedContent}
				</TabPanel>

				<TabPanel value={currentTab} index={2}>
					{semiLimitedContent}
				</TabPanel>
			</div>
		)
	},
	(prevProps, nextProps) => {
		if (
			prevProps.forbiddenContent !== nextProps.forbiddenContent ||
			prevProps.limitedContent !== nextProps.limitedContent ||
			prevProps.semiLimitedContent !== nextProps.semiLimitedContent
		)
			return false
		return true
	}
)

function allyProps(index: number) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	}
}

export default TabbedView
