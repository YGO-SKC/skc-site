import { FC, Fragment, memo, startTransition, useEffect, useState } from 'react'
import { Skeleton } from '@mui/material'

import Section from '../../util/generic/Section'

import YGOCardWithQuantity from '../YGOCardWithQuantity'
import FetchHandler from '../../../helper/FetchHandler'
import DownstreamServices from '../../../helper/DownstreamServices'
import GenericNonBreakingErr from '../../util/exception/GenericNonBreakingErr'

import '../../../css/card/ygo-card-suggestion.css'
import Hint from '../../util/generic/Hints'

import SuggestionSection from './SuggestionSection'

type _CardSuggestion = {
	cardID: string
	cardColor: cardColor
}

function transformReferences(references: CardReference[]): JSX.Element[] {
	return references !== null
		? references.map((reference: CardReference) => {
				return <YGOCardWithQuantity key={reference.card.cardID} card={reference.card} occurrences={reference.occurrences} />
		  })
		: []
}

function transformSupport(support: SKCCard[]): JSX.Element[] {
	return support !== null
		? support.map((reference: SKCCard) => {
				return <YGOCardWithQuantity key={reference.cardID} card={reference} occurrences={1} />
		  })
		: []
}

const CardSuggestions: FC<_CardSuggestion> = memo(
	({ cardID, cardColor }) => {
		const [materialSuggestions, setMaterialSuggestions] = useState<JSX.Element[]>([])
		const [referenceSuggestions, setReferenceSuggestions] = useState<JSX.Element[]>([])
		const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(true)

		const [materialFor, setMaterialFor] = useState<JSX.Element[]>([])
		const [referencedBy, setReferencedBy] = useState<JSX.Element[]>([])
		const [isLoadingSupport, setIsLoadingSupport] = useState<boolean>(true)

		const [hasError, setHasError] = useState<boolean>(false)

		const isLoading = (): boolean => {
			return isLoadingSuggestions || isLoadingSupport
		}

		useEffect(() => {
			startTransition(() => {
				FetchHandler.handleFetch(
					`${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card/${cardID}`,
					(json: CardSuggestionOutput) => {
						setMaterialSuggestions(transformReferences(json.namedMaterials))
						setReferenceSuggestions(transformReferences(json.namedReferences))
						setIsLoadingSuggestions(false)
					},
					false
				)?.catch((_err) => {
					setIsLoadingSuggestions(false)
					setHasError(true)
				})

				FetchHandler.handleFetch(
					`${DownstreamServices.SKC_SUGGESTION_HOST_NAME}/api/v1/suggestions/card/${cardID}/support`,
					(json: CardSupportOutput) => {
						setMaterialFor(transformSupport(json.materialFor))
						setReferencedBy(transformSupport(json.referencedBy))
						setIsLoadingSupport(false)
					},
					false
				)?.catch((_err) => {
					setIsLoadingSupport(false)
					setHasError(true)
				})
			})
		}, [cardID])

		return (
			<Section
				sectionHeaderBackground={cardColor !== undefined ? (cardColor?.replace(/Pendulum-/gi, '') as cardColor) : ''}
				sectionName='Suggestions'
				sectionContent={
					<div className='section-content'>
						{!isLoading() && materialSuggestions.length === 0 && referenceSuggestions.length === 0 && materialFor.length === 0 && <Hint>Nothing here 🤔</Hint>}
						{isLoading() && <Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='380px' />}
						{!isLoading() && !hasError && (
							<Fragment>
								<SuggestionSection suggestions={materialSuggestions} sectionName='Named Materials' />
								<SuggestionSection suggestions={materialFor} sectionName='Material For' />
								<SuggestionSection suggestions={referenceSuggestions} sectionName='References' />
								<SuggestionSection suggestions={referencedBy} sectionName='Referenced By' />
							</Fragment>
						)}
						{!isLoadingSuggestions && hasError && <GenericNonBreakingErr errExplanation={'🤯 Suggestion Engine Is Offline 🤯'} />}
					</div>
				}
			/>
		)
	},
	(prevProps, newProps) => {
		if (prevProps.cardID !== newProps.cardID) return false

		return true
	}
)

export default CardSuggestions