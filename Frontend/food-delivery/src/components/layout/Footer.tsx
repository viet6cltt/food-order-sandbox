import React from 'react'
import { Link } from 'react-router-dom';

type Props = {
	className?: string
}

const Footer: React.FC<Props> = ({ className = '' }) => {
	const year = new Date().getFullYear()

	return (
		<footer className={`bg-white ${className}`} aria-labelledby="footer-heading">
			<h2 id="footer-heading" className="sr-only">Footer</h2>
			<div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div className="md:flex md:items-center md:justify-between">
					<div className="flex items-center space-x-3">
						<Link to="/" className="text-lg font-semibold text-green-600">Food Order</Link>
						<p className="text-sm text-gray-500">Delivering happiness since 2025</p>
					</div>

					<div className="mt-4 md:mt-0 flex items-center space-x-6">
						<nav aria-label="Footer" className="flex space-x-4">
							<Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link>
							<Link to="/help" className="text-sm text-gray-600 hover:text-gray-900">Help</Link>
							<Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms</Link>
							<Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy</Link>
						</nav>
						<div className="flex items-center space-x-3">
							<a href="https://www.facebook.com/" aria-label="Facebook" className="text-gray-400 hover:text-gray-600">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.2V12h2.2V9.7c0-2.2 1.3-3.4 3.3-3.4.96 0 1.96.17 1.96.17v2.15h-1.1c-1.08 0-1.42.67-1.42 1.36V12h2.42l-.39 2.9h-2.03v7A10 10 0 0 0 22 12" />
								</svg>
							</a>
						</div>
					</div>
				</div>

				<div className="mt-6 border-t pt-6">
					<p className="text-sm text-gray-500">© {year} Food Order. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer

