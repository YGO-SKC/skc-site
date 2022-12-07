import '../../css/nav/navigation-icon.css'
import '../../css/nav/messages.css'

import { useState, useEffect, Fragment, startTransition } from 'react'
import { Typography, IconButton, Popover, Badge } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

import DownstreamServices from '../../helper/DownstreamServices'
import FetchHandler from '../../helper/FetchHandler'
import GenericNonBreakingErr from '../util/exception/GenericNonBreakingErr'
import MessageItemComponent from './MessageItemComponent'

function Messages() {
	const [messagesAnchor, setMessagesAnchor] = useState<HTMLButtonElement | undefined>(undefined)
	const [messagesList, setMessagesList] = useState<JSX.Element[]>([])

	const [numMessages, setNumMessages] = useState(0)
	const [numNewMessages, setNumNewMessages] = useState(0)

	const [newestMessageSeen, setNewestMessageSeen] = useState<string>('')
	const [errorFetchingMessages, setErrorFetchingMessages] = useState(false)

	const isDisplayingNotifications = Boolean(messagesAnchor)

	useEffect(() => {
		startTransition(() => {
			FetchHandler.handleFetch(
				`${DownstreamServices.HEART_API_HOST_NAME}/api/v1/message?service=skc&tags=skc-site,skc-api`,
				(messageData: HeartApiMessageOutput) => {
					const totalMessages = messageData.messages.length

					let findNumNewMessages = false
					let _numNewMessages = 0
					const previousNewestMessageTimeStamp = localStorage.getItem('previousNewestMessage') as string
					const previousNewestMessageDate = new Date(previousNewestMessageTimeStamp)

					setNumMessages(totalMessages)

					if (totalMessages > 0) {
						setNewestMessageSeen(messageData.messages[0].createdAt)

						if (previousNewestMessageTimeStamp !== messageData.messages[0].createdAt) {
							findNumNewMessages = true
						}
					}

					setMessagesList(
						messageData.messages.map((message: HeartApiMessageItem, index: number) => {
							const creationDate = new Date(message.createdAt)

							if (findNumNewMessages) {
								if (previousNewestMessageDate >= creationDate) {
									findNumNewMessages = false
								} else {
									_numNewMessages++
								}
							}

							return <MessageItemComponent key={creationDate.toString()} creationDate={creationDate} message={message} isLastMessage={index === totalMessages - 1} />
						})
					)

					setNumNewMessages(_numNewMessages)
				},
				false
			)?.catch((_err) => {
				setErrorFetchingMessages(true)
			})
		})
	}, [])

	return (
		<Fragment>
			<Badge className='communication-message-badge' badgeContent={numNewMessages} variant='standard' color='error'>
				<IconButton
					className='styled-icon-button'
					onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
						setMessagesAnchor(event.currentTarget)
					}}
					aria-label='show 17 new notifications'
					color='inherit'
				>
					<NotificationsIcon />
				</IconButton>
			</Badge>

			<Popover
				style={{ overflowX: 'hidden', overflowY: 'hidden' }}
				id={isDisplayingNotifications ? 'notification-popover' : undefined}
				open={isDisplayingNotifications}
				anchorEl={messagesAnchor}
				onClose={() => {
					setNumNewMessages(0)
					setMessagesAnchor(undefined)
					localStorage.setItem('previousNewestMessage', newestMessageSeen)
				}}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<div className='communication-popper-container'>
					<Typography className='communication-message-body' variant='h2'>
						🚨 Messages {errorFetchingMessages ? '⁉️' : `(${numMessages})`}
					</Typography>
					<br />

					{errorFetchingMessages ? <GenericNonBreakingErr errExplanation='No meaningful impact to the site functionality expected.' /> : messagesList}
				</div>
			</Popover>
		</Fragment>
	)
}

export default Messages
