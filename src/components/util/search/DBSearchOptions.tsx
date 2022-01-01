import { Avatar, Box, Typography } from '@mui/material'
import { FC } from 'react'

const DBSearchOptions: FC<{ props: React.HTMLAttributes<HTMLLIElement>; searchSubject: string; cardNameOption: string; cardIdOption: string; monsterTypeOption: string }> = ({
	props,
	searchSubject,
	cardNameOption,
	cardIdOption,
	monsterTypeOption,
}) => {
	const UPPERCASE_CARD_NAME = cardNameOption.toUpperCase()
	const UPPERCASE_SEARCH_TERM = searchSubject.toUpperCase()

	const INDEX_OF_SEARCH_TERM = UPPERCASE_CARD_NAME.indexOf(UPPERCASE_SEARCH_TERM)
	const LENGTH_OF_SEARCH_TERM = UPPERCASE_SEARCH_TERM.length

	return (
		<Box component='li' {...props} className='search-suggestions-parent'>
			<Avatar className='card-image-avatar' alt={`${cardNameOption}-Avatar`} src={`https://images.thesupremekingscastle.com/cards/tn/${cardIdOption}.jpg`} />
			<div className='search-suggestions-info-parent'>
				<Typography className='search-suggestion-text' variant='subtitle1'>
					{cardNameOption.slice(0, INDEX_OF_SEARCH_TERM)}
					<strong className='search-suggestion-substring-match'>{cardNameOption.slice(INDEX_OF_SEARCH_TERM, INDEX_OF_SEARCH_TERM + LENGTH_OF_SEARCH_TERM)}</strong>
					{cardNameOption.slice(INDEX_OF_SEARCH_TERM + LENGTH_OF_SEARCH_TERM)}
				</Typography>
				<Typography variant='body1' className='search-suggestion-text search-suggestion-subheader'>
					{monsterTypeOption}
				</Typography>
			</div>
		</Box>
	)
}

export default DBSearchOptions