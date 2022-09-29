<script>
	import { page } from "$app/stores";
	import BoostrapCollapse from "$lib/client/components/bootstrap/BoostrapCollapse.svelte";

	let showMainMenuMobile = false;

	function isMenuItemActive(basePath, pathname) {
		return pathname === basePath || (basePath !== '/' && pathname.startsWith(basePath));
	}
</script>

<div id="wrapper" class="d-flex flex-column">
	<header>
		<div class="container main" id="header-content">
			<nav class="navbar navbar-expand-sm">
                <span id="site-title" class="navbar-brand">
                    <a href="/" id="site-title-logo">
                    	<span id="site-title-text">Consent Observatory</span>
					</a>
                </span>
				<BoostrapCollapse targetId="main-menu" show={showMainMenuMobile} />
				<button class="navbar-toggler" type="button" on:click={() => showMainMenuMobile = !showMainMenuMobile}>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="navbar-collapse collapse" id="main-menu">
					<ul class="navbar-nav">
						<li class="nav-item">
							<a href="/analysis/new" class="nav-link" class:active={isMenuItemActive('/analysis/new', $page.url.pathname)}>New Analysis</a>
						</li>
						<li class="nav-item">
							<a href="/help" class="nav-link" class:active={isMenuItemActive('/help', $page.url.pathname)}>Help</a>
						</li>
						<li class="nav-item">
							<a href="/about" class="nav-link" class:active={isMenuItemActive('/about', $page.url.pathname)}>About</a>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	</header>

	<div class="container main content d-flex flex-column flex-fill">
		<slot></slot>
	</div>

	<footer>
		<div class="container main">
			<div class="row">
				<div class="col-sm-12">
					<span>Created by Peter B. Vahlstrup 2022</span>
				</div>
			</div>
		</div>
	</footer>
</div>