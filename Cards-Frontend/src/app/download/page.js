'use client';
import '../_assets/css/home.css';
import '../_assets/css/error.css';
import '../_assets/css/success.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faInstagram,
	faFacebookSquare,
	faTwitter,
	faYoutube,
	faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
// import { Hourglass } from "react-loader-spinner";
import { useEffect, useLayoutEffect, useState } from 'react';
import Card from '../_components/Card';
import { useSearchParams } from 'next/navigation';
import Footer from '../_components/Footer';

const Result = () => {
	const [loading, setLoading] = useState(true);
	const [res, setRes] = useState(false);
	const [cards, setCards] = useState([]);
	const [added_cards, setAddedCards] = useState([]);
	const [userIdFromQuery, setUserId] = useState('');

	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const userIdFromQuery = query.get('user_id');
		if (userIdFromQuery) {
			setUserId(userIdFromQuery);
		} else {
			console.error('No user_id found in URL');
		}
		// console.log('hello: ', userIdFromQuery);

		const fetchRes = async () => {
			try {
				if (!userIdFromQuery) {
					console.error('User ID is missing. Cannot proceed with the request.');
					return;
				}

				// Include userIdFromQuery as a query parameter
				const response = await fetch(
					`https://cardsapi.alcheringa.in/download/${userIdFromQuery}`
				);
				const data = await response.json();

				if (data.processed_cards) {
					setRes(true);
					setCards(data.processed_cards);
					localStorage.setItem('cards', JSON.stringify(data.processed_cards));
				} else {
					setRes(false);
				}
				setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchRes();
		setAddedCards(JSON.parse(localStorage.getItem('cards')) || []);
	}, []);

	// const fetchRes = async () => {
	// 	try {
	// 		const res = await fetch(`http://localhost:8000/result/${txn_id}`);
	// 		const data = await res.json();
	// 		if (data.processed_cards) {
	// 			setRes(true);
	// 			setCards(data.processed_cards);
	// 			localStorage.setItem('cards', JSON.stringify(data.processed_cards));
	// 		} else {
	// 			setRes(false);
	// 		}
	// 		setLoading(false);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	// useEffect(() => {
	// 	const fetchRes = async () => {
	// 		try {
	// 			if (!userIdFromQuery) {
	// 				console.error('User ID is missing. Cannot proceed with the request.');
	// 				return;
	// 			}

	// 			// Include userIdFromQuery as a query parameter
	// 			const response = await fetch(
	// 				`http://localhost:8000/download/${userIdFromQuery}`
	// 			);
	// 			const data = await response.json();

	// 			if (data.processed_cards) {
	// 				setRes(true);
	// 				setCards(data.processed_cards);
	// 				localStorage.setItem('cards', JSON.stringify(data.processed_cards));
	// 			} else {
	// 				setRes(false);
	// 			}
	// 			setLoading(false);
	// 		} catch (error) {
	// 			console.error('Error fetching data:', error);
	// 		}
	// 	};

	// 	fetchRes();
	// 	setAddedCards(JSON.parse(localStorage.getItem('cards')) || []);
	// }, [userIdFromQuery]);

	return (
		<>
			<div className='home-page'>
				<div className='texture'></div>
				<div>
					<img
						src='images/bottom-border.png'
						alt='bottom-border'
						className='bottom-border'
					/>
				</div>
				{/* {loading && (
          <Hourglass
            visible={true}
            colors={["#FE3989", "#A62269"]}
            height={80}
            width={80}
            wrapperStyle={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )} */}
				{!loading && (
					<>
						<div className='main'>
							<div className='grids'></div>
							<div className='alcher'>
								<h1>ALCHERINGA</h1>
								<div className='rstar1'>
									<img src='images/star1.png' alt='' />
								</div>
								<div className='rstar2'>
									<img src='images/star2.png' alt='' />
								</div>
								<div className='rstar3'>
									<img src='images/star3.png' alt='' />
								</div>
							</div>
							{res && (
								<>
									<div className='page'>
										<div className='failText'>
											<img src='images/success.svg' />
											<h1>YOUR ALCHER CARD</h1>
										</div>
										<p className='text'>
											Here are your Alcheringa 2025 cards.
										</p>
										<div className='attDown'>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													width: '100%',
													alignItems: 'flex-start',
												}}
											>
												<div className='att'>
													<p className='attend'>Attendee</p>
													<p className='pass'>Pass-holder</p>
												</div>
												{/* <div className='down'>
													<a
														href={`http://localhost:8000/download-all?txn_id=${txn_id}`}
													>
														<p className='download'>DOWNLOAD ALL</p>
														<img src='images/download.svg' />
													</a>
												</div> */}
											</div>
											<div className='cards'>
												{added_cards
													? added_cards.map((card, index) => (
															<Card card={card} key={index} id={index} />
													  ))
													: cards.map((card, index) => (
															<Card card={card} key={index} id={index} />
													  ))}
											</div>
											<div className='btn'>
												<p>BUY MORE CARDS HERE</p>
												<img src='images/arrow.svg' />
											</div>
										</div>
									</div>
								</>
							)}

							{!res && (
								<div className='page'>
									<div className='failText'>
										<img src='images/error.svg' />
										<h1 style={{ color: '#DB5356' }}>
											THERE WAS A FAILURE IN YOUR TRANSACTION
										</h1>
									</div>
									<p className='text'>
										We couldn't book any card for you due to failure in
										transaction
									</p>
									<div className='btn'>
										<p>TRY AGAIN</p>
										<img src='images/arrow.svg' />
									</div>
								</div>
							)}
							<Footer />
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default Result;
