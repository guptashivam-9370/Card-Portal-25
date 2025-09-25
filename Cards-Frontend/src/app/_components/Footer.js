import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faSquareFacebook,
  faXTwitter,
  faYoutube,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import styles from "./footer.module.css";

const Footer = () => {
	return (
		<> 
			<div className={styles.footer}>
				<img src='images/footer-logo.png' alt='' className={styles.footerLogo} />
				<div className={styles.foot}>
					<div className={styles.topPart}>
						<div className={styles.foot1}>
							<div className={styles.top1}>
								<div className={styles.follow}>
									<div className={styles.iconHead}>Follow us on</div>
									<div className={styles.icons}> 
										<a href='https://www.instagram.com/alcheringaiitg/'>
											<FontAwesomeIcon
												icon={faInstagram}
											/>
										</a>
										<a href='https://www.facebook.com/alcheringaiitg'>
											<FontAwesomeIcon
												icon={faSquareFacebook}
											/>
										</a>
										<a href='https://twitter.com/alcheringaiitg'>
											<FontAwesomeIcon
												icon={faXTwitter}
											/>
										</a>
										<a href='https://www.youtube.com/c/AlcheringaIITG'>
											<FontAwesomeIcon
												icon={faYoutube}
											/>
										</a>
										<a href='https://whatsapp.com/channel/0029Va9UOVX3gvWjTFtkwg3V'>
											<FontAwesomeIcon
												icon={faWhatsapp}
											/>
										</a>
									</div>
								</div>
								<div className={styles.enquiry}>
									<p>For business Enquiries</p>
									<p>
									<a href="mailto:alcheringa@iitg.ac.in">alcheringa@iitg.ac.in</a>
									</p>
								</div>
							</div>
						</div>
						<div className={styles.foot2}>
							<div className={styles.queries}>For queries contact:</div>
							<div className={styles.names}>
								<div className={styles.info}>
									<div className={styles.contact}>
										<span>Rudra Daruwale</span>
										<a className={styles.phoneNo} href='tel:+919970092047'>+91 99700 92047</a>
									</div>
									<div className={styles.arrow1}>
										<img src='images/name_arrow.png' alt='' />
									</div>
								</div>
								<div className={styles.info}>
									{' '}
									<div className={styles.contact}>
										<span>Vikas Bishnoi</span>
										<a className={styles.phoneNo} href='tel:+919509106771'>+91 95091 06771</a>
									</div>
									<div className={styles.arrow1}>
										<img src='images/name_arrow.png' alt='' />
									</div>
								</div>
								<div className={styles.info}>
									{' '}
									<div className={styles.contact}>
										<span>Rishi Kawa</span>
										<a className={styles.phoneNo} href='tel:+919920303954'>+91 99203 03954</a>
									</div>
									<div className={styles.arrow1}>
										<img src='images/name_arrow.png' alt='' />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.bottomPart}>
						<div className={styles.bottom1}>
							Designed and Developed by{' '}
							<span className={styles.popupContainer}>
								<span className={styles.popup}>Alcher Creatives</span>
								<div className={styles.tooltip}>Sai Sankeerth V</div>
							</span>
							<span> & </span>
							<span className={styles.popupContainer}>
								<span className={styles.popup}>Alcher Web Operations</span>
								<div className={styles.tooltip}>
									<p>Ashish More</p>
									<p>Vedant Shah</p>
									<p>Sristi Vats</p>
									<p>Mrigank Pendyala</p>
									<p>Ayush Wani</p>
								</div>
							</span>
						</div>
					</div>
				</div>
				<div className={styles.footM}>
					<div className={styles.follow}>
						<div className={styles.iconHead}>Follow us on</div>
						<div className={styles.icons}>
							<a href='https://www.instagram.com/alcheringaiitg/'>
								<FontAwesomeIcon icon={faInstagram} width={24} height={24} />
							</a>
							<a href='https://www.facebook.com/alcheringaiitg'>
								<FontAwesomeIcon
									icon={faSquareFacebook}
									width={24}
									height={24}
								/>
							</a>
							<a href='https://twitter.com/alcheringaiitg'>
								<FontAwesomeIcon icon={faXTwitter} width={24} height={24} />
							</a>
							<a href='https://www.youtube.com/c/AlcheringaIITG'>
								<FontAwesomeIcon icon={faYoutube} width={24} height={24} />
							</a>
							<a href='https://whatsapp.com/channel/0029Va9UOVX3gvWjTFtkwg3V'>
								<FontAwesomeIcon icon={faWhatsapp} width={24} height={24} />
							</a>
						</div>
					</div>
					<div className={styles.foot2}>
						<div className={styles.queries}>For queries contact:</div>
						<div className={styles.names}>
							<div className={styles.info}>
								<div className={styles.contact}>
									<span>Rudra Daruwale</span>
									<a className={styles.mobileNo} href='tel:+919970092047'>+91 99700 92047</a>
								</div>
								<div className={styles.arrow1}>
									<img src='images/name_arrow.png' alt='' />
								</div>
							</div>
							<div className={styles.info}>
								{' '}
								<div className={styles.contact}>
									<span>Vikas Bishnoi</span>
									<a className={styles.mobileNo} href='tel:+919509106771'>+91 9509106771</a>
								</div>
								<div className={styles.arrow1}>
									<img src='images/name_arrow.png' alt='' />
								</div>
							</div>
							<div className={styles.info}>
								{' '}
								<div className={styles.contact}>
									<span>Rishi Kawa</span>
									<a className={styles.mobileNo} href='tel:+919920303954'>+91 99203 03954</a>
								</div>
								<div className={styles.arrow1}>
									<img src='images/name_arrow.png' alt='' />
								</div>
							</div>
						</div>
					</div>
					<div className={styles.enquiry}>
						<p>For business Enquiries</p>
						<p>
						<a href="mailto:alcheringa@iitg.ac.in">alcheringa@iitg.ac.in</a>
						</p>
					</div>
					<div className={styles.bottom1}>
						Designed and Developed by{' '}
						<span className={styles.popupContainer}>
							<span className={styles.popup}>Alcher Creatives</span>
							<div className={styles.tooltip}>Sai Sankeerth V</div>
						</span>
						<span> & </span>
						<span className={styles.popupContainer}>
							<span className={styles.popup}>Alcher Web Operations</span>
							<div className={styles.tooltip}>
								<p>Ashish More</p>
								<p>Vedant Shah</p>
								<p>Sristi Vats</p>
								<p>Mrigank Pendyala</p>
								<p>Ayush Wani</p>
							</div>
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default Footer;
