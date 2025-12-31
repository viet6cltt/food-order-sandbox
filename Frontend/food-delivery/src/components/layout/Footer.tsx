import React from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {
	className?: string
}

const Footer: React.FC<Props> = ({ className = '' }) => {
	const year = new Date().getFullYear()
	const navigate = useNavigate();
	
	const handleOnClickHome = () => {
		navigate('/');
	}

	return (
		<footer className={`bg-white ${className}`} aria-labelledby="footer-heading">
			<h2 id="footer-heading" className="sr-only">Footer</h2>
			<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div className="md:flex md:items-center md:justify-between">
					<div className="flex items-center space-x-3">
						<button className="text-lg font-semibold text-green-600" type="button" onClick={handleOnClickHome}>Food Delivery</button>
						<p className="text-sm text-gray-500">Delivering happiness since 2025</p>
					</div>

					<div className="mt-4 md:mt-0 flex items-center space-x-6">
						<nav aria-label="Footer" className="flex space-x-4">
							<a href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</a>
							<a href="/help" className="text-sm text-gray-600 hover:text-gray-900">Help</a>
							<a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms</a>
							<a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
						</nav>

						<div className="flex items-center space-x-3">
							{/* Simple social icons (decorative) */}
							<a href="#" aria-label="Twitter" className="text-gray-400 hover:text-gray-600">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path d="M8 19c7.732 0 11.955-6.403 11.955-11.955 0-.182 0-.364-.012-.545A8.56 8.56 0 0 0 22 4.92a8.27 8.27 0 0 1-2.357.646A4.117 4.117 0 0 0 21.448 3.1a8.224 8.224 0 0 1-2.605.996A4.107 4.107 0 0 0 11.07 7.29a11.65 11.65 0 0 1-8.457-4.29 4.106 4.106 0 0 0 1.27 5.48A4.073 4.073 0 0 1 1.8 8.713v.052a4.106 4.106 0 0 0 3.293 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 17.54a11.616 11.616 0 0 0 6 1.758" />
								</svg>
							</a>
							<a href="#" aria-label="Facebook" className="text-gray-400 hover:text-gray-600">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2V12h2.2V9.7c0-2.2 1.3-3.4 3.3-3.4.96 0 1.96.17 1.96.17v2.15h-1.1c-1.08 0-1.42.67-1.42 1.36V12h2.42l-.39 2.9h-2.03v7A10 10 0 0 0 22 12" />
								</svg>
							</a>
						</div>
					</div>
				</div>

				<div className="mt-6 border-t pt-6">
					<p className="text-sm text-gray-500">© {year} Food Delivery. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer

