/**
 * Bridge Group Solutions (BGS) - Reusable Component Loader
 * Dynamically loads and injects components/navbar.html and components/footer.html into all pages
 */

// Production HTTPS Enforcement
(function() {
    if (typeof window !== 'undefined' && window.location) {
        var host = window.location.hostname;
        var proto = window.location.protocol;
        var isLocal = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.') || host.endsWith('.local') || proto === 'file:';
        if (proto === 'http:' && !isLocal) {
            window.location.replace('https:' + window.location.href.substring(proto.length));
        }
    }
})();

// 1. Global Mobile Navigation Handlers
window.toggleMobileMenu = function() {
    var menu = document.getElementById('mobile-nav-menu');
    var icon = document.getElementById('mobile-menu-icon');
    if (menu) {
        var isHidden = menu.classList.toggle('hidden');
        var button = document.getElementById('mobile-menu-btn');
        if (button) { button.setAttribute('aria-expanded', String(!isHidden)); button.setAttribute('aria-controls', 'mobile-nav-menu'); button.setAttribute('aria-label', isHidden ? 'Open menu' : 'Close menu'); }
        if (icon) {
            icon.textContent = isHidden ? 'menu' : 'close';
        }
    }
};

window.toggleMobileServices = function() {
    var dropdown = document.getElementById('mobile-services-dropdown');
    var arrow = document.getElementById('mobile-services-arrow');
    var btn = document.getElementById('mobile-services-btn');
    if (dropdown) {
        var isHidden = dropdown.classList.toggle('hidden');
        if (arrow) {
            if (isHidden) {
                arrow.classList.remove('rotate-180');
            } else {
                arrow.classList.add('rotate-180');
            }
        }
        if (btn) {
            btn.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
        }
    }
};

(function() {
    // Calculate folder depth and relative prefixes
    function getPathPrefixes() {
        var path = window.location.pathname || '';
        var inSubdir = path.indexOf('/services/') !== -1 || path.indexOf('/legal/') !== -1 || path.indexOf('/templates/') !== -1;
        var inServices = path.indexOf('/services/') !== -1;
        var inLegal = path.indexOf('/legal/') !== -1;

        var root = inSubdir ? '../' : '';
        var services = inServices ? '' : (inSubdir ? '../services/' : 'services/');
        var legal = inLegal ? '' : (inSubdir ? '../legal/' : 'legal/');

        return { root: root, services: services, legal: legal };
    }

    // Determine active nav link token replacements
    function getActiveTokens() {
        var path = window.location.pathname || '';
        var activeClass = 'text-primary font-bold';
        var inactiveClass = 'text-on-surface-variant hover:text-primary';

        return {
            '{{ACTIVE_SERVICES}}': path.indexOf('/services/') !== -1 ? 'text-primary font-bold' : 'text-on-surface font-semibold hover:text-primary',
            '{{ACTIVE_WHY}}': path.indexOf('why-bgs') !== -1 ? activeClass : inactiveClass,
            '{{ACTIVE_ABOUT}}': path.indexOf('about') !== -1 ? activeClass : inactiveClass,
            '{{ACTIVE_PORTFOLIO}}': path.indexOf('portfolio') !== -1 ? activeClass : inactiveClass,
            '{{ACTIVE_GALLERY}}': path.indexOf('gallery') !== -1 ? activeClass : inactiveClass,
            '{{ACTIVE_BLOGS}}': path.indexOf('blogs') !== -1 ? activeClass : inactiveClass,
            '{{ACTIVE_CAREERS}}': path.indexOf('careers') !== -1 ? activeClass : inactiveClass,
            '{{ACTIVE_CONTACT}}': path.indexOf('contact') !== -1 ? activeClass : inactiveClass
        };
    }

    function processTemplate(html) {
        var p = getPathPrefixes();
        var cta = p.root + 'contact.html';

        html = html.replace(/\{\{ROOT_DIR\}\}/g, p.root);
        html = html.replace(/\{\{SERVICES_DIR\}\}/g, p.services);
        html = html.replace(/\{\{LEGAL_DIR\}\}/g, p.legal);
        html = html.replace(/\{\{CTA_URL\}\}/g, cta);

        var activeTokens = getActiveTokens();
        for (var token in activeTokens) {
            html = html.split(token).join(activeTokens[token]);
        }

        return html;
    }

    // Fallback templates in case of offline file:// protocol CORS restrictions
    var fallbackNavbar = `<!-- BGS_NAVBAR_START -->
<header class="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all duration-300 bgs-main-navbar">
	<div class="h-20 max-w-[1320px] mx-auto px-6 md:px-12 flex items-center justify-between gap-gutter">
		<div class="flex items-center gap-space-lg">
			<a class="flex items-center gap-2.5 group" data-path="solutions" href="{{ROOT_DIR}}index.html">
				<img src="{{ROOT_DIR}}assets/logo.webp" alt="Bridge Group Solutions Logo" class="h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
				<span class="md:hidden font-headline-sm text-[22px] font-bold tracking-tight text-on-surface">BGS</span>
				<span class="hidden md:inline-block font-headline-sm text-[17px] xl:text-[20px] font-bold tracking-tight text-on-surface whitespace-nowrap">Bridge Group Solutions</span>
				<span class="relative flex h-2.5 w-2.5 items-center justify-center">
					<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_#ad2b0e]"></span>
				</span>
			</a>
			<div class="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low">
				<span class="font-label-eyebrow text-label-eyebrow text-primary tracking-wider uppercase">EST. 2014</span>
			</div>
		</div>

		<nav class="hidden md:flex items-center gap-7">
			
			<a class="font-body-sm text-body-sm {{ACTIVE_ABOUT}} hover:text-primary transition-colors duration-200" href="{{ROOT_DIR}}about.html">About</a>
			<a class="font-body-sm text-body-sm {{ACTIVE_WHY}} hover:text-primary transition-colors duration-200" href="{{ROOT_DIR}}why-bgs.html">Why Us</a>

			<!-- Core Services Dropdown Trigger -->
			<div class="relative group/nav-service services-dropdown-trigger py-2">
				<a href="{{SERVICES_DIR}}web.html" class="inline-flex items-center gap-1 font-body-sm text-body-sm {{ACTIVE_SERVICES}} transition-colors duration-200">
					<span>Services</span>
					<span class="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover/nav-service:rotate-180 services-dropdown-arrow">expand_more</span>
				</a>
				
				<!-- Dropdown Panel -->
				<div class="absolute top-full -left-20 pt-3 w-[520px] opacity-0 translate-y-2 pointer-events-none group-hover/nav-service:opacity-100 group-hover/nav-service:translate-y-0 group-hover/nav-service:pointer-events-auto transition-all duration-200 ease-out z-50 services-dropdown-menu">
					<div class="p-3.5 bg-white rounded-2xl border border-surface-container-high shadow-[0_25px_60px_rgba(0,0,0,0.22)]" style="background-color: #ffffff !important;">
						<div class="px-2.5 pb-2.5 mb-1.5 border-b border-surface-container-high/60 flex items-center justify-between">
							<span class="font-label-code text-[11px] font-bold uppercase tracking-wider text-secondary">ENTERPRISE PRACTICES &bull; 6 SERVICES</span>
							<a href="{{ROOT_DIR}}index.html#core-services" class="font-label-code text-[11px] font-bold text-primary hover:underline flex items-center gap-1">
								<span>All Capabilities</span>
								<span class="material-symbols-outlined text-[12px]">arrow_forward</span>
							</a>
						</div>
						
						<div class="grid grid-cols-2 gap-2">
							<a href="{{SERVICES_DIR}}web.html" class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors duration-150 group/item">
								<div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-primary group-hover/item:text-white transition-colors">
									<span class="material-symbols-outlined text-[18px]">language</span>
								</div>
								<div class="flex flex-col">
									<span class="font-headline-sm text-[13px] font-bold text-on-surface group-hover/item:text-primary transition-colors">Web Development</span>
									<span class="text-[11px] text-secondary leading-snug line-clamp-1">Headless &amp; edge platforms</span>
								</div>
							</a>

							<a href="{{SERVICES_DIR}}app.html" class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors duration-150 group/item">
								<div class="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-violet-700 group-hover/item:text-white transition-colors">
									<span class="material-symbols-outlined text-[18px]">devices</span>
								</div>
								<div class="flex flex-col">
									<span class="font-headline-sm text-[13px] font-bold text-on-surface group-hover/item:text-primary transition-colors">App Development</span>
									<span class="text-[11px] text-secondary leading-snug line-clamp-1">iOS, Android &amp; hybrid apps</span>
								</div>
							</a>

							<a href="{{SERVICES_DIR}}data.html" class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors duration-150 group/item">
								<div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-emerald-700 group-hover/item:text-white transition-colors">
									<span class="material-symbols-outlined text-[18px]">query_stats</span>
								</div>
								<div class="flex flex-col">
									<span class="font-headline-sm text-[13px] font-bold text-on-surface group-hover/item:text-primary transition-colors">Data Analytics</span>
									<span class="text-[11px] text-secondary leading-snug line-clamp-1">Predictive intelligence &amp; telemetry</span>
								</div>
							</a>

							<a href="{{SERVICES_DIR}}crm.html" class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors duration-150 group/item">
								<div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-amber-700 group-hover/item:text-white transition-colors">
									<span class="material-symbols-outlined text-[18px]">neurology</span>
								</div>
								<div class="flex flex-col">
									<span class="font-headline-sm text-[13px] font-bold text-on-surface group-hover/item:text-primary transition-colors">CRM (Pulse AI)</span>
									<span class="text-[11px] text-secondary leading-snug line-clamp-1">Autonomous omnichannel triage</span>
								</div>
							</a>

							<a href="{{SERVICES_DIR}}erp.html" class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors duration-150 group/item">
								<div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-blue-700 group-hover/item:text-white transition-colors">
									<span class="material-symbols-outlined text-[18px]">schema</span>
								</div>
								<div class="flex flex-col">
									<span class="font-headline-sm text-[13px] font-bold text-on-surface group-hover/item:text-primary transition-colors">ERP &amp; Automation</span>
									<span class="text-[11px] text-secondary leading-snug line-clamp-1">Custom workflows &amp; inventory</span>
								</div>
							</a>

							<a href="{{SERVICES_DIR}}project.html" class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container-low transition-colors duration-150 group/item">
								<div class="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-orange-700 group-hover/item:text-white transition-colors">
									<span class="material-symbols-outlined text-[18px]">group_work</span>
								</div>
								<div class="flex flex-col">
									<span class="font-headline-sm text-[13px] font-bold text-on-surface group-hover/item:text-primary transition-colors">Project Outsourcing</span>
									<span class="text-[11px] text-secondary leading-snug line-clamp-1">Dedicated enterprise squads</span>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>

			<a class="font-body-sm text-body-sm {{ACTIVE_PORTFOLIO}} hover:text-primary transition-colors duration-200" href="{{ROOT_DIR}}portfolio.html">Portfolio</a>
			<a class="font-body-sm text-body-sm {{ACTIVE_GALLERY}} hover:text-primary transition-colors duration-200" href="{{ROOT_DIR}}gallery.html">Gallery</a>
			<a class="font-body-sm text-body-sm {{ACTIVE_BLOGS}} hover:text-primary transition-colors duration-200" href="{{ROOT_DIR}}blogs.html">Blogs</a>
			<a class="font-body-sm text-body-sm {{ACTIVE_CAREERS}} hover:text-primary transition-colors duration-200" href="{{ROOT_DIR}}careers.html">Careers</a>
			<a class="font-body-sm text-body-sm {{ACTIVE_CONTACT}} hover:text-primary transition-colors duration-200" href="{{ROOT_DIR}}contact.html">Contact</a>
		</nav>

		<div class="flex items-center gap-3">
			<a class="hidden sm:inline-flex items-center justify-center px-6 py-2.5 rounded-full text-white font-label-pill text-label-pill shadow-[0_6px_20px_rgba(235,87,55,0.35)] hover:shadow-[0_8px_25px_rgba(235,87,55,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border border-white/20" href="{{CTA_URL}}" style="background: linear-gradient(135deg, rgb(173, 43, 14) 0%, rgb(235, 87, 55) 60%, rgb(255, 120, 73) 100%);">Schedule Briefing</a>
			<button type="button" onclick="toggleMobileMenu()" class="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container-low text-primary hover:bg-surface-container transition-colors" aria-label="Toggle Menu" id="mobile-menu-btn">
				<span class="material-symbols-outlined text-[24px]" id="mobile-menu-icon">menu</span>
			</button>
		</div>
	</div>

	<!-- Mobile Navigation Menu -->
	<div id="mobile-nav-menu" class="hidden md:hidden border-t border-surface-container-high/60 bg-white px-6 pt-5 pb-8 flex flex-col shadow-xl" style="background-color: #ffffff !important;">
		<div class="flex flex-col gap-3.5">
			<a class="text-[15px] font-normal {{ACTIVE_ABOUT}} hover:text-primary transition-colors" href="{{ROOT_DIR}}about.html">About</a>
			<a class="text-[15px] font-normal {{ACTIVE_WHY}} hover:text-primary transition-colors" href="{{ROOT_DIR}}why-bgs.html">Why Us</a>
		</div>

		<hr class="border-t border-surface-container-high/60 my-4" />

		<!-- Services Dropdown (Collapsible on Mobile) -->
		<div>
			<button type="button" onclick="toggleMobileServices()" class="w-full flex items-center justify-between py-1.5 px-1 -mx-1 rounded-lg hover:bg-surface-container-low transition-colors text-left group focus:outline-none" aria-expanded="false" id="mobile-services-btn">
				<span class="flex items-center gap-2">
					<span class="font-label-code text-[11px] font-bold uppercase tracking-wider text-primary">SERVICES</span>
					<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">6</span>
				</span>
				<div class="flex items-center gap-1 text-secondary group-hover:text-primary transition-colors">
					<span class="text-[11px] font-medium text-secondary group-hover:text-primary">View All</span>
					<span class="material-symbols-outlined text-[18px] transition-transform duration-200" id="mobile-services-arrow">expand_more</span>
				</div>
			</button>
			<div id="mobile-services-dropdown" class="hidden pt-3 pb-1 transition-all duration-200">
				<div class="grid grid-cols-2 gap-x-6 gap-y-3.5">
					<a class="text-[15px] font-normal text-on-surface/90 hover:text-primary transition-colors" href="{{SERVICES_DIR}}web.html">Web Development</a>
					<a class="text-[15px] font-normal text-on-surface/90 hover:text-primary transition-colors" href="{{SERVICES_DIR}}app.html">App Development</a>
					<a class="text-[15px] font-normal text-on-surface/90 hover:text-primary transition-colors" href="{{SERVICES_DIR}}data.html">Data Analytics</a>
					<a class="text-[15px] font-normal text-on-surface/90 hover:text-primary transition-colors" href="{{SERVICES_DIR}}crm.html">CRM (Pulse AI)</a>
					<a class="text-[15px] font-normal text-on-surface/90 hover:text-primary transition-colors" href="{{SERVICES_DIR}}erp.html">ERP &amp; Software</a>
					<a class="text-[15px] font-normal text-on-surface/90 hover:text-primary transition-colors" href="{{SERVICES_DIR}}project.html">Project Pods</a>
				</div>
			</div>
		</div>

		<hr class="border-t border-surface-container-high/60 my-4" />

		<div class="flex flex-col gap-3.5">
			<a class="text-[15px] font-normal {{ACTIVE_PORTFOLIO}} hover:text-primary transition-colors" href="{{ROOT_DIR}}portfolio.html">Portfolio</a>
			<a class="text-[15px] font-normal {{ACTIVE_GALLERY}} hover:text-primary transition-colors" href="{{ROOT_DIR}}gallery.html">Gallery</a>
			<a class="text-[15px] font-normal {{ACTIVE_BLOGS}} hover:text-primary transition-colors" href="{{ROOT_DIR}}blogs.html">Blogs</a>
			<a class="text-[15px] font-normal {{ACTIVE_CAREERS}} hover:text-primary transition-colors" href="{{ROOT_DIR}}careers.html">Careers</a>
			<a class="text-[15px] font-normal {{ACTIVE_CONTACT}} hover:text-primary transition-colors" href="{{ROOT_DIR}}contact.html">Contact</a>
		</div>

		<a class="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full text-white font-medium text-[15px] text-center mt-6 shadow-[0_4px_16px_rgba(235,87,55,0.3)] hover:shadow-[0_6px_20px_rgba(235,87,55,0.45)] transition-all duration-200" href="{{CTA_URL}}" onclick="toggleMobileMenu()" style="background: linear-gradient(135deg, rgb(215, 65, 34) 0%, rgb(235, 87, 55) 50%, rgb(240, 105, 67) 100%);">Schedule Briefing</a>
	</div>
</header>
<!-- BGS_NAVBAR_END -->`;

    var fallbackFooter = `<!-- BGS_FOOTER_START -->
<!-- ENTERPRISE ARCHITECTURAL 4-COLUMN FOOTER (MATCHING USER-SPECIFIED STYLE) -->
<footer class="w-full bg-inverse-surface text-inverse-on-surface bgs-arch-footer">
	<div class="max-w-[1320px] mx-auto px-6 md:px-12 py-10 md:py-12 footer-container">
		<!-- 4-Column Architectural Grid with Vertical Dividers -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 lg:gap-0 pb-10 footer-grid">

			<!-- Column 1: Brand & Contact Info -->
			<div class="lg:pr-8 flex flex-col justify-between footer-col-1">
				<div>
					<a href="{{ROOT_DIR}}index.html" class="inline-flex items-center gap-2.5 mb-3.5 group">
						<img src="{{ROOT_DIR}}assets/logo.webp" alt="Bridge Group Solutions Logo" class="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
						<span class="font-headline-sm text-[20px] font-bold tracking-tight text-surface-container-lowest" style="color: #ffffff;">Bridge Group Solutions</span>
						<span class="relative flex h-2 w-2">
							<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
							<span class="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed"></span>
						</span>
					</a>
					<p class="font-body-sm text-[13px] text-surface-dim leading-[1.7] mb-6 max-w-sm">
						Delivering cutting-edge digital transformation, custom software development, ERP systems, data analytics, and cloud solutions to empower growing businesses.
					</p>
				</div>

				<div class="space-y-2.5 font-body-sm text-[13px] text-surface-dim">
					<div class="flex items-center gap-2">
						<svg class="w-4 h-4 text-primary-fixed shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
						<span>F356+4MJ, Ashok Marg, Moti Vihar, South City I, Sector 41, Gurugram, Haryana 122003</span>
					</div>
					<div class="flex items-center gap-2">
						<svg class="w-4 h-4 text-primary-fixed shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
						<a href="mailto:contactus@bridgegroupsolutions.com" class="hover:text-surface-container-lowest transition-colors footer-link">contactus@bridgegroupsolutions.com</a>
					</div>
				</div>
			</div>

			<!-- Column 2: Services (with Left Divider Border) -->
			<div class="lg:px-6 lg:border-l lg:border-white/15 flex flex-col footer-col-divider">
				<div class="font-label-eyebrow text-[12px] text-primary-fixed font-semibold mb-4 uppercase tracking-[0.04em] footer-col-heading">
					Services
				</div>
				<div class="flex flex-col gap-3 font-body-sm text-[13px] text-surface-dim footer-links">
					<a href="{{SERVICES_DIR}}web.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Web Development</a>
					<a href="{{SERVICES_DIR}}app.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Application Development</a>
					<a href="{{SERVICES_DIR}}data.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Data Analytics</a>
					<a href="{{SERVICES_DIR}}project.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Project Outsourcing</a>
					<a href="{{SERVICES_DIR}}erp.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">ERP and Custom Software</a>
					<a href="{{SERVICES_DIR}}crm.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">CRM</a>
				</div>
			</div>

			<!-- Column 3: Company (with Left Divider Border) -->
			<div class="lg:px-6 lg:border-l lg:border-white/15 flex flex-col footer-col-divider">
				<div class="font-label-eyebrow text-[12px] text-primary-fixed font-semibold mb-4 uppercase tracking-[0.04em] footer-col-heading">
					Company
				</div>
				<div class="flex flex-col gap-3 font-body-sm text-[13px] text-surface-dim footer-links">
					<a href="{{ROOT_DIR}}why-bgs.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Why BGS</a>
					<a href="{{ROOT_DIR}}portfolio.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Portfolio</a>
					<a href="{{ROOT_DIR}}about.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">About Us</a>
					<a href="{{ROOT_DIR}}careers.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Careers</a>
					<a href="{{ROOT_DIR}}gallery.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Gallery</a>
					<a href="{{ROOT_DIR}}blogs.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Blogs</a>
					<a href="{{ROOT_DIR}}contact.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Contact</a>
				</div>
			</div>

			<!-- Column 4: Legal (with Left Divider Border) -->
			<div class="lg:pl-6 lg:border-l lg:border-white/15 flex flex-col footer-col-legal">
				<div class="font-label-eyebrow text-[12px] text-primary-fixed font-semibold mb-4 uppercase tracking-[0.04em] footer-col-heading">
					Legal
				</div>
				<div class="flex flex-col gap-3 font-body-sm text-[13px] text-surface-dim footer-links">
					<a href="{{LEGAL_DIR}}disclaimer.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Disclaimer</a>
					<a href="{{LEGAL_DIR}}privacy-policy.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Privacy Policy</a>
					<a href="{{LEGAL_DIR}}terms-and-conditions.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Terms and Conditions</a>
					<a href="{{LEGAL_DIR}}cookie-policy.html" class="hover:text-surface-container-lowest transition-colors duration-150 footer-link">Cookie Policy</a>
				</div>
			</div>

		</div>

		<!-- Bottom Sub-Footer Bar -->
		<div class="border-t border-white/15 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4 font-body-sm text-[12px] text-surface-dim footer-bottom">
			<span>Copyright © 2026 Bridge Group Solutions. All rights reserved.</span>
			<div class="flex items-center gap-4 text-surface-dim social-icons">
				<a href="https://www.linkedin.com/company/bridge-group-solutions-pvt-ltd/" target="_blank" rel="noopener noreferrer" class="hover:text-surface-container-lowest transition-colors p-1" aria-label="LinkedIn">
					<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
				</a>
				<a href="https://x.com/Bridgegroupsol" target="_blank" rel="noopener noreferrer" class="hover:text-surface-container-lowest transition-colors p-1" aria-label="Twitter / X">
					<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
				</a>
				<a href="https://www.facebook.com/bridgegroupsolutiuions" target="_blank" rel="noopener noreferrer" class="hover:text-surface-container-lowest transition-colors p-1" aria-label="Facebook">
					<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
				</a>
				<a href="https://www.instagram.com/bridgegroupsolutions?stkn=dHk4YncycTZtZ2x5" target="_blank" rel="noopener noreferrer" class="hover:text-surface-container-lowest transition-colors p-1" aria-label="Instagram">
					<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
				</a>
			</div>
		</div>
	</div>
</footer>
<!-- BGS_FOOTER_END -->`;

    // Load component HTML via fetch with graceful local fallback
    function loadComponent(targetSelector, filePath, fallbackHtml) {
        var el = document.querySelector(targetSelector);
        if (!el) return;

        var p = getPathPrefixes();
        var fullPath = p.root + filePath;

        fetch(fullPath)
            .then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(function(html) {
                el.outerHTML = processTemplate(html);
            })
            .catch(function(err) {
                // Fallback to offline/file:// template
                el.outerHTML = processTemplate(fallbackHtml);
            });
    }

    function initBgsComponents() {
        // Load Navbar into #navbar, #navbar-placeholder, or <bgs-navbar>
        if (document.querySelector('#navbar')) {
            loadComponent('#navbar', 'components/navbar.html', fallbackNavbar);
        } else if (document.querySelector('#navbar-placeholder')) {
            loadComponent('#navbar-placeholder', 'components/navbar.html', fallbackNavbar);
        } else if (document.querySelector('bgs-navbar')) {
            loadComponent('bgs-navbar', 'components/navbar.html', fallbackNavbar);
        }

        // Load Footer into #footer, #footer-placeholder, or <bgs-footer>
        if (document.querySelector('#footer')) {
            loadComponent('#footer', 'components/footer.html', fallbackFooter);
        } else if (document.querySelector('#footer-placeholder')) {
            loadComponent('#footer-placeholder', 'components/footer.html', fallbackFooter);
        } else if (document.querySelector('bgs-footer')) {
            loadComponent('bgs-footer', 'components/footer.html', fallbackFooter);
        }
    }

    // Auto-close mobile menu on desktop resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 951) {
            var menu = document.getElementById('mobile-nav-menu');
            var icon = document.getElementById('mobile-menu-icon');
            if (menu && !menu.classList.contains('hidden')) {
                menu.classList.add('hidden');
            }
            if (icon) {
                icon.textContent = 'menu';
            }
        }
    });

    // Initialize immediately if targets exist in DOM, or on DOMContentLoaded
    if (document.querySelector('#navbar') || document.querySelector('#footer')) {
        initBgsComponents();
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBgsComponents);
    } else {
        initBgsComponents();
    }
})();
