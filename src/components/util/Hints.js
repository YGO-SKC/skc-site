import React from 'react'
import { Box, Typography } from '@material-ui/core'
import styled from 'styled-components'


const Hint = ( { children, variant, backgroundColor='#f6f2fb', textColor='#5e6d7d' } ) =>
{

	const HintBox = styled(Box)`
		&&
		{
			background-color: ${backgroundColor};
			padding: 1.4rem;
			max-width: 85%;
			width: 85%;
			border-radius: 1.25rem;
			margin: auto;
			margin-top: 2rem;
			margin-bottom: 2rem;
		}
	`


	const HintText = styled(Typography)`
		&&
		{
			color: ${textColor};
			margin: 0rem;
		}
	`


	return(
		<HintBox>
			<HintText variant={variant} align='center' >
				{ children }
			</HintText>
		</HintBox>
	)
}


export {Hint}