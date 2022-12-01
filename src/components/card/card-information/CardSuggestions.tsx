import { FC, memo, startTransition, useEffect, useState } from 'react'
import { Skeleton, Typography } from '@mui/material'

import Section from '../../util/Section'

import YGOCardWithQuantity from '../YGOCardWithQuantity'
import FetchHandler from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'
import Hint from '../../util/Hints'
import GenericNonBreakingErr from '../../util/exception/GenericNonBreakingErr'

type _CardSuggestion = {
	cardID: string
	cardColor: cardColor
}

const CardSuggestions: FC<_CardSuggestion> = memo(
	({ cardID, cardColor }) => {
		const [materialSuggestions, setMaterialSuggestions] = useState<JSX.Element[]>([])
		const [referenceSuggestions, setReferenceSuggestions] = useState<JSX.Element[]>([])
		const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(true)
		const [hasError, setHasError] = useState<boolean>(false)

		useEffect(() => {
			FetchHandler.handleFetch(
				`${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card/${cardID}`,
				(json: CardSuggestionOutput) => {
					let materials: JSX.Element[] = []
					let references: JSX.Element[] = []

					if (json.namedMaterials !== null) {
						materials = json.namedMaterials.map((reference: CardReference) => {
							return <YGOCardWithQuantity key={reference.card.cardID} card={reference.card} occurrences={reference.occurrences} />
						})
					}

					if (json.namedReferences !== null) {
						references = json.namedReferences.map((reference: CardReference) => {
							return <YGOCardWithQuantity key={reference.card.cardID} card={reference.card} occurrences={reference.occurrences} />
						})
					}

					startTransition(() => {
						setMaterialSuggestions(materials)
						setReferenceSuggestions(references)
						setIsLoadingSuggestions(false)
					})
				},
				false
			)?.catch((_err) => {
				startTransition(() => {
					setIsLoadingSuggestions(false)
					setHasError(true)
				})
			})
		}, [cardID])

		return (
			<div>
				<Section
					sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''}
					sectionName='Suggestions'
					sectionContent={
						<div className='section-content'>
							{isLoadingSuggestions && <Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='380px' />}
							{!isLoadingSuggestions && !hasError && (
								<div>
									<div className='group-with-outline'>
										<Typography variant='h4'>Named Summoning Materials</Typography>
										{materialSuggestions.length === 0 ? (
											<Hint>Nothing here 🤔</Hint>
										) : (
											<div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '.3rem' }}>{materialSuggestions}</div>
										)}
									</div>

									<br />

									<div className='group-with-outline'>
										<Typography variant='h4'>Named References</Typography>
										{referenceSuggestions.length === 0 ? (
											<Hint>Nothing here 🤔</Hint>
										) : (
											<div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '.3rem' }}>{referenceSuggestions}</div>
										)}
									</div>
								</div>
							)}
							{!isLoadingSuggestions && hasError && (
								<div>
									<GenericNonBreakingErr errExplanation={'🤯 Suggestion Engine Is Offline 🤯'} />
								</div>
							)}
						</div>
					}
				/>
			</div>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.cardID !== newProps.cardID) return false

		return true
	}
)

export default CardSuggestions
