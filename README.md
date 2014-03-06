<div id="content">
                <h1><a name="The%20Command-line%20Interface">The Command-line Interface</a></h1>

<p>This guide shows you how to create applications and deploy them to
various native mobile platforms using the <code>cordova</code> command-line
interface (CLI). This tool allows you to create new projects, build
them on different platforms, and run them within an emulator. You can
also use the CLI to initialize project code, after which you use
various platforms' SDKs to develop them further.</p>

<h2><a name="The%20Command-line%20Interface_prerequisites">Prerequisites</a></h2>

<p>Before running any command-line tools, you need to install SDKs for
each platform you wish to target.
(See the <a href="guide_platforms_index.md.html#Platform%20Guides">Platform Guides</a> for more details.)</p>

<p>To add support or rebuild a project for any platform, you need to run
the command-line interface from the same machine that supports the
platform's SDK. The CLI supports the following combinations:</p>

<ul>
<li>iOS             (Mac)</li>
<li>Android         (Mac, Linux)</li>
<li>BlackBerry 10   (Mac, Linux, Windows)</li>
<li>Windows Phone 7 (Windows)</li>
<li>Windows Phone 8 (Windows)</li>
</ul>

<p>On the Mac, the command-line is available via the <em>Terminal</em>
application. On the PC, it's available as <em>Command Prompt</em> under
<em>Accessories</em>.</p>

<p>The more likely it is that you run the CLI from different machines,
the more it makes sense to maintain a remote source code repository,
whose assets you pull down to local working directories.</p>

<p>To install the <code>cordova</code> command-line tool, follow these steps:</p>

<ol>
<li><p>Download and install <a class="external" href="http://nodejs.org/">Node.js</a>. Following
installation, you should be able to invoke <code>node</code> or <code>npm</code> on your
command line.</p></li>
<li>
<p>Install the <code>cordova</code> utility. In Unix, prefixing the additional
<code>sudo</code> command may be necessary to install development utilities in
otherwise restricted directories:</p>

<pre class="prettyprint"><code><span class="pln">$ sudo npm install </span><span class="pun">-</span><span class="pln">g cordova<br></span></code></pre>

<p>The installation log may produce errors for any uninstalled
platform SDKs.  Following installation, you should be able to run
<code>cordova</code> on the command line.</p>
</li>
</ol>

<h2><a name="The%20Command-line%20Interface_create_the_app">Create the App</a></h2>

<p>Go to the directory where you maintain your source code, and run a
command such as the following:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova create hello com</span><span class="pun">.</span><span class="pln">example</span><span class="pun">.</span><span class="pln">hello </span><span class="typ">HelloWorld</span><span class="pln"><br></span></code></pre>

<p>It may take some time for the command to complete, so be patient. Run
the <code>cordova -d</code> to see information about progress.</p>

<p>The first argument specifies a <em>hello</em> directory to be generated
for your project. Its <code>www</code> subdirectory houses your application's
home page, along with various resources under <code>css</code>, <code>js</code>, and <code>img</code>,
which follow common web development file-naming conventions. The
<code>config.xml</code> file contains important metadata needed to generate and
distribute the application.</p>

<p>The other two arguments are optional: the <code>com.example.hello</code> argument
provides your project with a reverse domain-style identifier, and the
<code>HelloWorld</code> provides the application's display text. You can edit
both of these values later in the <code>config.xml</code> file.</p>

<h2><a name="The%20Command-line%20Interface_add_platforms">Add Platforms</a></h2>

<p>All subsequent commands need to be run within the project's directory,
or any subdirectories within its scope:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cd hello<br></span></code></pre>

<p>Before you can build the project, you need to specify a set of target
platforms. Your ability to run these commands depends on whether your
machine supports each SDK, and whether you have already installed each
SDK.  Run any of these from a Mac:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova platform add ios<br>&nbsp; &nbsp; $ cordova platform add android<br>&nbsp; &nbsp; $ cordova platform add blackberry10<br></span></code></pre>

<p>Run any of these from a Windows machine, where <em>wp</em> refers to
different versions of the Windows Phone operating system:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova platform add wp7<br>&nbsp; &nbsp; $ cordova platform add wp8<br>&nbsp; &nbsp; $ cordova platform add android<br>&nbsp; &nbsp; $ cordova platform add blackberry10<br></span></code></pre>

<p>Run this to check your current set of platforms:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova platforms ls<br></span></code></pre>

<p>(Note the <code>platform</code> and <code>platforms</code> commands are synonymous.)</p>

<p>Run either of the following synonymous commands to remove a platform:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova platform remove blackberry10<br>&nbsp; &nbsp; $ cordova platform rm android<br></span></code></pre>

<p>Running commands to add or remove platforms affects the contents of
the project's <em>platforms</em> directory, where each specified platform
appears as a subdirectory. The <em>www</em> source directory is reproduced
within each platform's subdirectory, appearing for example in
<code>platforms/ios/www</code> or <code>platforms/android/assets/www</code>.  By default,
each platform's configuration file is set up to be able to access all
of Cordova's APIs.</p>

<p>If you wish, you can use an SDK at this point to open the project you
created. However, any edits you make to the project within an SDK
affect the derivative set of assets, not the original cross-platform
source files. Use this approach if you simply want to initialize a
project.
(See the <a href="guide_platforms_index.md.html#Platform%20Guides">Platform Guides</a> for information on how to develop applications within each SDK.)
Read on if you wish to use command-line tools for the entire
development cycle.</p>

<h2><a name="The%20Command-line%20Interface_build_the_app">Build the App</a></h2>

<p>By default, the <code>cordova create</code> script generates a skeletal web-based
application whose home page is the project's <code>www/index.html</code> file.
Edit this application however you want, but any initialization should
be specified as part of the <code><a href="cordova_events_events.md.html#deviceready">deviceready</a></code> event handler, referenced by
default from <code>www/js/index.js</code>.
<!-- XREF
(See the Application Development Guide for details.)
XREF --></p>

<p>Run the following command to iteratively build the project:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova build<br></span></code></pre>

<p>This generates platform-specific code within the project's <code>platforms</code>
subdirectory.  You can optionally limit the scope of each build to
specific platforms:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova build ios<br></span></code></pre>

<p>The <code>cordova build</code> command is a shorthand for the following, which in
this example is also targeted to a single platform:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova prepare ios<br>&nbsp; &nbsp; $ cordova compile ios<br></span></code></pre>

<p>In this case, once you run <code>prepare</code>, you can use Apple's Xcode SDK as
an alternative to modify and compile the platform-specific code that
Cordova generates within <code>platforms/ios</code>. You can use the same
approach with other platforms' SDKs.</p>

<h2><a name="The%20Command-line%20Interface_test_the_app_on_an_emulator_or_device">Test the App on an Emulator or Device
</a></h2>

<p>SDKs for mobile platforms often come bundled with emulators that
execute a device image, so that you can launch the app from the home
screen and see how it interacts with many platform features.  Run a
command such as the following to rebuild the app and view it within a
specific platform's emulator:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova emulate android<br></span></code></pre>

<p>Some mobile platforms emulate a particular device by default, such as
the iPhone for iOS projects. For other platforms, you may need to
first associate a device with an emulator.
(See the <a href="guide_platforms_index.md.html#Platform%20Guides">Platform Guides</a> for details.)
For example, you may first run the <code>android</code> command to launch the
Android SDK, then run a particular device image, which launches it
according to its default behavior:</p>

<p><img src="img/guide/cli/android_emulate_init.png" alt="" title=""></p>

<p>Following up with the <code>cordova emulate</code> command refreshes the emulator
image to display the latest application, which is now available for
launch from the home screen:</p>

<p><img src="img/guide/cli/android_emulate_install.png" alt="" title=""></p>

<p>Alternately, you can plug the handset into your computer and test the
app directly:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova run android<br></span></code></pre>

<p>Before running this command, you need to set up the device for
testing, following procedures that vary for each platform. In
Android's case, you would have to enable a <strong>USB debugging</strong> option on
the device, and perhaps add a USB driver depending on your development
environmnent.
See <a href="guide_platforms_index.md.html#Platform%20Guides">Platform Guides</a> for details on each platform's requirements.</p>

<h2><a name="The%20Command-line%20Interface_add_features">Add Features</a></h2>

<p>When you build and view a new project, the default application that
appears doesn't do very much. You can modify the app in many ways to
take advantage of standard web technologies, but for the app to
communicate closely with various device-level features, you need to
add plugins that provide access to core Cordova APIs.</p>

<p>A <em>plugin</em> is a bit of add-on code that provides an interface to
native components. You can design your own plugin interface, for
example when designing a hybrid app that mixes a Cordova WebView with
native components. (See <a href="guide_hybrid_webviews_index.md.html#Embedding%20WebViews">Embedding WebViews</a> and <a href="guide_hybrid_plugins_index.md.html#Plugin%20Development%20Guide">Plugin Development Guide</a> for details.)  More commonly, you would add a plugin to enable
one of Cordova's basic device-level features
<!-- XREF
discussed in the Application Development Guide and
XREF -->
detailed in the <a href="index.md.html#API%20Reference">API Reference</a>.</p>

<p>The <code>cordova plugin add</code> command requires you to specify the
repository for the plugin code.  Here are examples of features you
might add:</p>

<ul>
<li>
<p>Basic device information (<a href="cordova_device_device.md.html#Device">Device</a> API):</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-device.git</span><span class="pln"><br></span></code></pre>
</li>
<li>
<p>Network <a href="cordova_connection_connection.md.html#Connection">Connection</a> and Battery <a href="cordova_events_events.md.html#Events">Events</a>:</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-network-information.git</span><span class="pln"><br>$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-battery-status.git</span><span class="pln"><br></span></code></pre>
</li>
<li>
<p><a href="cordova_accelerometer_accelerometer.md.html#Accelerometer">Accelerometer</a>, <a href="cordova_compass_compass.md.html#Compass">Compass</a>, and <a href="cordova_geolocation_geolocation.md.html#Geolocation">Geolocation</a>:</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-device-motion.git</span><span class="pln"><br>$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-device-orientation.git</span><span class="pln"><br>$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-geolocation.git</span><span class="pln"><br></span></code></pre>
</li>
<li>
<p><a href="cordova_camera_camera.md.html#Camera">Camera</a>, <a href="cordova_media_media.md.html#Media">Media</a> playback and <a href="cordova_media_capture_capture.md.html#Capture">Capture</a>:</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git</span><span class="pln"><br>$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-media-capture.git</span><span class="pln"><br>$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-media.git</span><span class="pln"><br></span></code></pre>
</li>
<li>
<p>Access files on device or network (<a href="cordova_file_file.md.html#File">File</a> API):</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-file.git</span><span class="pln"><br>$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-file-transfer.git</span><span class="pln"><br></span></code></pre>
</li>
<li>
<p><a href="cordova_notification_notification.md.html#Notification">Notification</a> via dialog box or vibration:</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git</span><span class="pln"><br>$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-vibration.git</span><span class="pln"><br></span></code></pre>
</li>
<li>
<p><a href="cordova_contacts_contacts.md.html#Contacts">Contacts</a>:</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-contacts.git</span><span class="pln"><br></span></code></pre>
</li>
<li>
<p><a href="cordova_globalization_globalization.md.html#Globalization">Globalization</a>:</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-globalization.git</span><span class="pln"><br></span></code></pre>
</li>
<li>
<p><a href="cordova_splashscreen_splashscreen.md.html#Splashscreen">Splashscreen</a>:</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-splashscreen.git</span><span class="pln"><br></span></code></pre>
</li>
<li>
<p>Open new browser windows (<a href="cordova_inappbrowser_inappbrowser.md.html#InAppBrowser">InAppBrowser</a>):</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git</span><span class="pln"><br></span></code></pre>
</li>
<li>
<p>Debug console:</p>

<pre class="prettyprint"><code><span class="pln">$ cordova plugin add https</span><span class="pun">:</span><span class="com">//git-wip-us.apache.org/repos/asf/cordova-plugin-console.git</span><span class="pln"><br></span></code></pre>
</li>
</ul>

<p>Use <code>plugin ls</code> (or <code>plugin list</code>, or <code>plugin</code> by itself) to view
currently installed plugins. Each displays by its identifier:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova plugin ls &nbsp; &nbsp;</span><span class="com"># or 'plugin list'</span><span class="pln"><br>&nbsp; &nbsp; </span><span class="pun">[</span><span class="pln"> </span><span class="str">'org.apache.cordova.core.console'</span><span class="pln"> </span><span class="pun">]</span><span class="pln"><br></span></code></pre>

<p>To remove a plugin, refer to it by the same identifier that appears in
the listing. For example, here is how you would remove support for a
debug console from a release version:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ cordova plugin rm org</span><span class="pun">.</span><span class="pln">apache</span><span class="pun">.</span><span class="pln">cordova</span><span class="pun">.</span><span class="pln">core</span><span class="pun">.</span><span class="pln">console &nbsp; &nbsp; &nbsp; &nbsp;<br>&nbsp; &nbsp; $ cordova plugin remove org</span><span class="pun">.</span><span class="pln">apache</span><span class="pun">.</span><span class="pln">cordova</span><span class="pun">.</span><span class="pln">core</span><span class="pun">.</span><span class="pln">console &nbsp; &nbsp;</span><span class="com"># same</span><span class="pln"><br></span></code></pre>

<p>You can batch-remove or add plugins by specifying more than one
argument for each command.</p>

<h2><a name="The%20Command-line%20Interface_customize_each_platform">Customize Each Platform</a></h2>

<p>While Cordova allows you to easily deploy an app for many different
platforms, sometimes you need to add customizations.  In that case,
you don't want to modify the source files in various <code>www</code> directories
within the top-level <code>platforms</code> directory, because they're regularly
replaced with the top-level <code>www</code> directory's cross-platform source.</p>

<p>Instead, the top-level <code>merges</code> directory offers a place to specify
assets to deploy on specific platforms. Each platform-specific
subdirectory within <code>merges</code> mirrors the directory structure of the
<code>www</code> source tree, allowing you to override or add files as needed.
For example, here is how you might uses <code>merges</code> to boost the default
font size for Android devices:</p>

<ul>
<li>
<p>Edit the <code>www/index.html</code> file, adding a link to an additional CSS
file, <code>overrides.css</code> in this case:</p>

<pre class="prettyprint"><code><span class="tag">&lt;link</span><span class="pln"> </span><span class="atn">rel</span><span class="pun">=</span><span class="atv">"stylesheet"</span><span class="pln"> </span><span class="atn">type</span><span class="pun">=</span><span class="atv">"text/css"</span><span class="pln"> </span><span class="atn">href</span><span class="pun">=</span><span class="atv">"css/overrides.css"</span><span class="pln"> </span><span class="tag">/&gt;</span><span class="pln"><br></span></code></pre>
</li>
<li><p>Optionally create an empty <code>www/css/overrides.css</code> file, which would
apply for all non-Android builds, preventing a missing-file error.</p></li>
<li>
<p>Create a <code>css</code> subdirectory within <code>merges/android</code>, then add a
corresponding <code>overrides.css</code> file. Specify CSS that overrides the
12-point default font size specified within <code>www/css/index.css</code>, for
example:</p>

<pre class="prettyprint"><code><span class="pln">body </span><span class="pun">{</span><span class="pln"> font</span><span class="pun">-</span><span class="pln">size</span><span class="pun">:</span><span class="lit">14px</span><span class="pun">;</span><span class="pln"> </span><span class="pun">}</span><span class="pln"><br></span></code></pre>
</li>
</ul>

<p>When you rebuild the project, the Android version features the custom
font size, while others remain unchanged.</p>
<p>You can also use <code>merges</code> to add files not present in the original
<code>www</code> directory. For example, an app can incorporate a <em>back button</em>
graphic into the iOS interface, stored in
<code>merges/ios/img/back_button.png</code>, while the Android version can
instead capture <code><a href="cordova_events_events.md.html#backbutton">backbutton</a></code> events from the corresponding hardware
button.</p>

<h2><a name="The%20Command-line%20Interface_updating_cordova">Updating Cordova</a></h2>

<p>After installing the <code>cordova</code> utility, you can always
update it to the latest version by running the following command:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ sudo npm update </span><span class="pun">-</span><span class="pln">g cordova<br></span></code></pre>

<p>Use this syntax to install a specific version:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ sudo npm install </span><span class="pun">-</span><span class="pln">g cordova@3</span><span class="pun">.</span><span class="lit">0.0</span><span class="pln"><br></span></code></pre>

<p>Run <code>cordova -v</code> to see the currently running version.  Run the <code>npm
info</code> command for a longer listing that includes the current version
along with other available version numbers:</p>

<pre class="prettyprint"><code><span class="pln">&nbsp; &nbsp; $ npm info cordova<br></span></code></pre>

<p>Cordova 3.0 is the first version to support the command-line interface
described in this section. If you are updating from a version prior to
3.0, you need to create a new project as described above, then copy
the older application's assets into the top-level <code>www</code> directory.
Where applicable, further details about upgrading to 3.0 are available
in the <a href="guide_platforms_index.md.html#Platform%20Guides">Platform Guides</a>.  Once you upgrade to the <code>cordova</code>
command-line interface and use <code>npm update</code> to stay current, the more
time-consuming procedures described there are no longer relevant.</p>

            </div>
