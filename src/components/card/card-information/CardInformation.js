import React, { useState, useEffect, lazy } from 'react'
import {Helmet} from 'react-helmet'

import { handleFetch } from '../../../helper/FetchHandler'
import NAME_maps_ENDPOINT from '../../../helper/YgoApiEndpoints'
import { MainContentContainer } from '../../MainContent'

import OneThirdTwoThirdsGrid from '../../util/grid/OneThirdTwoThirdsGrid'


import CardData from './CardData'
import CardInformationRelatedContent from './CardInformationRelatedContent'

const Breadcrumb = lazy( () => import('../../Breadcrumb') )


const Card = ( { match, history } ) =>
{
	Card.cardID = match.params.cardId

	const [isLoading, setIsLoading] = useState(true)

	const [cardName, setCardName] = useState(undefined)
	const [cardColor, setCardColor] = useState(undefined)
	const [cardEffect, setCardEffect] = useState(undefined)
	const [cardAttribute, setCardAttribute] = useState(undefined)
	const [monsterType, setMonsterType] = useState(undefined)
	const [monsterAtk, setMonsterAtk] = useState(undefined)
	const [monsterDef, setMonsterDef] = useState(undefined)
	const [monsterAssociation, setMonsterAssociation] = useState(undefined)

	const [productInfo, setPackInfo] = useState([])
	const [banListInfo, setBanListInfo] = useState([])

	const [dynamicCrumbs, setDynamicCrumbs] = useState([...Card.crumbs, ''])

	const helmetData = useEffect( () => {
		handleFetch(`${NAME_maps_ENDPOINT['cardInstanceUrl']}${Card.cardID}?allInfo=true`, history, (json) => {
			setDynamicCrumbs([...Card.crumbs, json.cardID])

			setCardName(json.cardName)
			setCardColor(json.cardColor)
			setCardEffect(json.cardEffect)
			setCardAttribute(json.cardAttribute)
			setMonsterType(json.monsterType)
			setMonsterAtk(json.monsterAttack)
			setMonsterDef(json.monsterDefense)
			setMonsterAssociation(json.monsterAssociation)

			setPackInfo( (json.foundIn === undefined)? [] : json.foundIn )
			setBanListInfo( (json.restrictedIn === undefined)? [] : json.restrictedIn )

			setIsLoading(false)
		})

		return (
		<Helmet>
			<title>SKC - Card: {Card.cardID}</title>
			<meta
				name={`SKC - Card: ${Card.cardID}`}
				content={`Information for YuGiOh card ${cardName} such as ban lists it was in, products it can be found in, effect/stats, etc.`}
				/>
			<meta name="keywords" content={`YuGiOh, The Supreme Kings Castle, card, ${cardName}, ${Card.cardID}, ${cardColor}`} />
		</Helmet>
		)

	}, [])


	return (
		<MainContentContainer >
			{helmetData}

			<Breadcrumb crumbs={ dynamicCrumbs } />

			<OneThirdTwoThirdsGrid
				oneThirdComponent={
					<CardData
						cardName={cardName}
						cardColor={cardColor}
						cardEffect={cardEffect}
						cardAttribute={cardAttribute}
						monsterType={monsterType}
						monsterAtk={monsterAtk}
						monsterDef={monsterDef}
						monsterAssociation={monsterAssociation}
						cardID={Card.cardID}
						isLoading={isLoading}
					/>
				}
				twoThirdComponent={
					<CardInformationRelatedContent cardName={cardName}
						isLoading={isLoading}
						cardID={Card.cardID}
						productInfo={productInfo}
						banListInfo={banListInfo} />
					}
				/>

		</MainContentContainer>
	)
}


Card.crumbs = ['Home', 'Card Browse']
export default Card