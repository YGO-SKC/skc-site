import React from 'react'

import {ImageWithNumber} from './ImageWithText'


const levelImage = <img
	src={`${process.env.PUBLIC_URL}/Img/card_level.svg`}
	alt='Card Level'
	style={{ width: '34px', height: '34px', display: 'inline-block', marginRight: '.35rem', verticalAlign: 'middle' }} />

const rankImage = <img
	src={`${process.env.PUBLIC_URL}/Img/card_rank.svg`}
	alt='Card Rank'
	style={{ width: '34px', height: '34px', display: 'inline-block', marginRight: '.35rem', verticalAlign: 'middle' }} />


const CardAssociation = ( { monsterAssociation, attribute } ) =>
{
	if (monsterAssociation === undefined)	return (null)
	if (monsterAssociation.level === undefined && monsterAssociation.rank === undefined)	return (null)


	return(
		<div style={{ width: '100%', marginBottom: '.35rem', textAlign: 'center'}} >
			<div style={{ background: 'rgba(255, 255, 255, .75)', display: 'inline-block', paddingTop: '.2rem', paddingBottom: '.2rem', paddingLeft: '.7rem', paddingRight: '.7rem', borderRadius: '4rem', textAlign: 'center'}} >
				<img
					alt='Card Attribute'
					style={{ width: '34px', height: '34px', display: 'inline-block', marginRight: '.85rem', verticalAlign: 'middle' }}
					src={`${process.env.PUBLIC_URL}/Img/${attribute}.svg`}
					/>

				{(monsterAssociation.level === undefined)?
					undefined
					: <ImageWithNumber
						imageComponent={levelImage}
						text={`x${monsterAssociation.level}`}
						/>
				}

				{(monsterAssociation.rank === undefined)?
					undefined
					: <ImageWithNumber
						imageComponent={rankImage}
						text={`x${monsterAssociation.rank}`}
						/>
				}
			</div>
		</div>
	)
}

export default CardAssociation