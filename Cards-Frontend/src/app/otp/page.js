'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../otp/otp.css';
import '../_assets/css/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faInstagram,
	faFacebookSquare, 
	faTwitter,
	faYoutube,
	faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import Footer from '../_components/Footer';
// API functions
const API_BASE_URL = 'https://cardsapi.alcheringa.in';

const OTPComponent = () => {
	const [Sending, setSending] = useState(false);
	const otpRefs = useRef([]);
	const [email, setEmail] = useState('');
	const [otpValues, setOtpValues] = useState(Array(6).fill(''));
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const [otpSent, setOtpSent] = useState(false);
	const [countdown, setCountdown] = useState(60);
	const [canResendOTP, setCanResendOTP] = useState(false);
	const [correctOTP, setcorrectOTP] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [isError, setError] = useState('');
	const [isMessage, setMessage] = useState('');
	const [isDissable, setDissable] = useState(false);
	const [isSuccess, setSuccess] = useState(false);
	const sendOTP = async (email) => {
		setSending(true);
		try {
			const response = await fetch(`${API_BASE_URL}/api/generate-otp/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || 'Failed to send OTP');
			}
			setSending(false);
			return data;
		} catch (error) {
			console.error('Error sending OTP:', error);
			setSending(false);
			throw error.message || 'Failed to send OTP';
		}
	};

	const verifyOTP = async (email, otp) => {
		try {
			setSuccess(true);
			const response = await fetch(`${API_BASE_URL}/api/verify-otp/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, otp }),
			});
			const data = await response.json();
			if (!response.ok) {
				setcorrectOTP(false);
				throw new Error(data.error || 'Failed to verify OTP');
			}
			return data;
		} catch (error) {
			console.error('Error verifying OTP:', error);
			setSuccess(false);
			// throw error.message || 'Failed to verify OTP';
		}
	};

	useEffect(() => {
		const checkScreenSize = () => {
			setIsSmallScreen(window.innerWidth < 768);
		};
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	useEffect(() => {
		if (countdown === 0) {
			setCanResendOTP(true);
		}
	}, [countdown]);

	const handleEmailSubmit = async () => {
		if (!email) {
			setError('Please enter your email');
			return;
		}
		try {
			setIsLoading(true);
			setDissable(true);
			setError('');
			setMessage('');

			const response = await sendOTP(email);
			setMessage(response.message || 'OTP sent successfully');
			setOtpSent(true);
			setCountdown(60);
			setDissable(true);
			const intervalId = setInterval(() => {
				setCountdown((prevCountdown) => {
					if (prevCountdown <= 1) {
						clearInterval(intervalId);
						setDissable(false);
						return 0;
					}
					// console.log()
					return prevCountdown - 1;
				});
			}, 1000);
		} catch (err) {
			setError(err.message || 'Failed to send OTP');
			setDissable(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleOTPChange = (e, index) => {
		const value = e.target.value.replace(/\D/g, '');
		if (value.length <= 1) {
			const newOtpValues = [...otpValues];
			newOtpValues[index] = value;
			setOtpValues(newOtpValues);

			if (value.length === 1 && index < otpRefs.current.length - 1) {
				otpRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
			otpRefs.current[index - 1].focus();
			const newOtpValues = [...otpValues];
			newOtpValues[index - 1] = '';
			setOtpValues(newOtpValues);
		}
	};

	const handleVerifyOTP = async () => {
		const otpString = otpValues.join('');
		if (otpString.length !== 6) {
			setError('Please enter a complete 6-digit OTP');
			return;
		}

		try {
			setIsLoading(true);
			setError('');
			setMessage('');

			const response = await verifyOTP(email, otpString);
			setMessage(response.message || 'OTP verified successfully');
			// console.log(email);
			localStorage.setItem('verifiedEmail', JSON.stringify(email));
			router.push('/register');
		} catch (err) {
			setcorrectOTP(false);
			setError(err.message || 'Failed to verify OTP');
		} finally {
			setIsLoading(false);
		} 
	};

	return (
		<div className='home-page'>
			<div className='texture'></div>
			<div className='alcher'>
				<h1>
					Alcheringa
					<div className='rstar1'>
						<img src='images/star1.png' alt='' />
					</div>
					<div className='rstar2'>
						<img src='images/star2.png' alt='' />
					</div>
					<div className='rstar3'>
						<img src='images/star3.png' alt='' />
					</div>
				</h1>
			</div>
			<div className='text'>
				Welcome to Alcheringa!! To start with your journey, We need to verify
				you.
			</div>

			<div className='ver'>
				<div className='verify'>Verify Your Email ID</div>
				<div className='ver-text'>
					Please enter your e-mail ID. A one-time-passcode will be sent on the
					same to verify your E-Mail ID.
				</div>
			</div>

			<div className='chat'>
				<input
					type='email'
					className={`chat-input ${otpSent ? 'otp-sent' : ''}`}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					disabled={isLoading}
					placeholder='Enter your email'
				/>
				<div className='mobile-break'>
					{otpSent ? (
						<>
							<img className='image' src='images/success.svg' />
							<p
								className='white'
								onClick={canResendOTP ? handleEmailSubmit : null}
								style={{
									cursor: canResendOTP ? 'pointer' : 'default',
									textDecoration: 'underline',
								}}
							>
								Resend OTP
							</p>
							<p className='white-in'>{countdown > 0 ? 'in' : ''}</p>
							<p className='green'>
								{countdown > 0 ? `${countdown} seconds...` : ''}
							</p>
						</>
					) : (
						<p></p>
					)}
				</div>
			</div>
			<button
				className='send-otp'
				onClick={handleEmailSubmit}
				disabled={isDissable}
			>
				{Sending ? 'Sending...' : 'Send OTP'}
			</button>

			<p className='enter-otp'>Enter OTP</p>
			<div className='incor'>
				<div className='the-otp'>
					{otpValues.map((value, index) => (
						<input
							key={index}
							className='digit'
							type='number'
							maxLength='1'
							value={value}
							ref={(el) => (otpRefs.current[index] = el)}
							onChange={(e) => handleOTPChange(e, index)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							disabled={isLoading}
						/>
					))}
				</div>
				{correctOTP === false && (
					<div className='error-message'>Incorrect OTP</div>
				)}
			</div>
			<div className={isSuccess? 'pro': 'proc'}>
				<button
					className='proceed'
					onClick={handleVerifyOTP}
					disabled={isLoading}
				>
					{isSuccess ? 'Proceeding...' : 'Proceed'}	
					<img src='images/arrow1.svg' className='arrow' />
				</button>
			</div>
			<Footer />
		</div>
	);
};

export default OTPComponent;
