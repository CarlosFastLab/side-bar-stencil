// Importing component declarator
import { Component, Prop, h, State, Method } from '@stencil/core'

// We add the component declarator to indicate that this is a webcomponent
// The component declator takens in a config object
// Tag defines the "name"/"tag" of the webcomp
@Component({
    tag: 'cfl-side-drawer',
    // Accessing the css style file for stylling
    styleUrl: './side-drawer.css',

    // Using native shadowDOM
    // Because stencil automatically provides polyfills for older browsers
    // We save the extra attributes, shipping a smaller code with better performance
    shadow: true
})
export class SideDrawer {
    // Ideal for watching for changes coming from outside the component
    // We do not declare the type since we are already attributing a default state
    @State() showContactInfo = false;
    // Adding the Prop declarator and declaring title as an attribute
    // We are also setting reflect to true, so the attribute changes are reflected in the component
    @Prop({ reflect: true }) title: string;
    // We use this prop to watch for changes in the isopen attribute
    // We must also add reflect: true to reflect changes in the prop
    // And mutable: true to allow mutating the prop from inside the component
    @Prop({ reflect: true, mutable: true }) isopen: boolean;

    onCloseDrawer() {
        this.isopen = false
    }

    // We receive content as argument from button onClick
    onContentChange(content: string) {
        // Verifying if content === 'contact', if true, showContactInfo receives true
        // Else it receives false
        this.showContactInfo = content === 'contact'
    }

    @Method()
    open() {
        this.isopen = true
    }

    // Render method stencil executes to parse the DOM it should generate as part of the component
    render() {
        let mainContent = <slot />
        // If showContactInfo is true, we attribute the contact info to mainContact
        if (this.showContactInfo) {
            // We will alternate the mainContent with our onContentChange function
            mainContent = (
                <div class='contact-information'>
                    <h2>Contact Information</h2>
                    <p>You can reach us via phone or email</p>
                    <ul>
                        <li>Phone: 879784556</li>
                        <li>E-mail: <a href="mailto:something@something.com">something@something.com</a></li>
                    </ul>
                </div>
            )
        }
        // We will return an array since we want to have two top-level JSX elements
        return [
            <div class="backdrop" onClick={this.onCloseDrawer.bind(this)}></div>,
            <aside>
                <header>
                    <h1>{this.title}</h1>
                    {/* we must bind the function to 'this', relating to the class, 
                    otherwise we would refer to this as the btn */}
                    <button onClick={this.onCloseDrawer.bind(this)} class='close-btn'>X</button>
                </header>
                <section class='tabs'>
                    {/* Tabs buttons, responsible for alternating sidebar content 
                        We are taking advantage that .bind takes two parameters, 
                        First we pass this, to refer to the class
                        Second is used to pass on the identifier to our onContentChange function
                    */}
                    <button
                        class={!this.showContactInfo ? 'active' : ''}
                        onClick={this.onContentChange.bind(this, 'nav')}>
                        Navigation
                    </button>
                    <button
                        class={this.showContactInfo ? 'active' : ''}
                        onClick={this.onContentChange.bind(this, 'contact')}>
                        Contact
                    </button>
                </section>
                <main>
                    {/* Rendering mainContent based on our onContentChange */}
                    {mainContent}
                </main>
            </aside>
        ];
    }
}