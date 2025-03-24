// This example shows you how to set up React Stripe.js and use
// Embedded Checkout.
// Learn how to accept a payment using the official Stripe docs.
// https://stripe.com/docs/payments/accept-a-payment#web


import * as ElementsModule from './Elements';
import * as CustomCheckoutModule from './CustomCheckout';
import createElementComponent from './createElementComponent';
import * as mocks from '../../test/mocks';
import {
  CardElementComponent,
  PaymentElementComponent,
  PaymentRequestButtonElementComponent,
  ExpressCheckoutElementComponent,
} from '../types';
=======
import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {EmbeddedCheckoutProvider, EmbeddedCheckout} from '../../src';


import '../styles/common.css';


describe('createElementComponent', () => {
  let mockStripe: any;
  let mockElements: any;
  let mockElement: any;
  let mockCustomCheckoutSdk: any;

  let simulateElementsEvents: Record<string, any[]>;
  let simulateOn: any;
  let simulateOff: any;
  const simulateEvent = (event: string, ...args: any[]) => {
    simulateElementsEvents[event].forEach((fn) => fn(...args));
  };

  beforeEach(() => {
    mockStripe = mocks.mockStripe();
    mockElements = mocks.mockElements();
    mockCustomCheckoutSdk = mocks.mockCustomCheckoutSdk();
    mockElement = mocks.mockElement();
    mockStripe.elements.mockReturnValue(mockElements);
    mockElements.create.mockReturnValue(mockElement);
    mockStripe.initCustomCheckout.mockResolvedValue(mockCustomCheckoutSdk);
    mockCustomCheckoutSdk.createElement.mockReturnValue(mockElement);
    jest.spyOn(React, 'useLayoutEffect');

    simulateElementsEvents = {};
    simulateOn = jest.fn((event, fn) => {
      simulateElementsEvents[event] = [
        ...(simulateElementsEvents[event] || []),
        fn,
      ];
    });
    simulateOff = jest.fn((event, fn) => {
      simulateElementsEvents[event] = simulateElementsEvents[event].filter(
        (previouslyAddedFn) => previouslyAddedFn !== fn
      );
    });

    mockElement.on = simulateOn;
    mockElement.off = simulateOff;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('on the server - only for Elements', () => {
    const CardElement = createElementComponent('card', true);
    it('passes id to the wrapping DOM element', () => {
      const {container} = render(
        <Elements stripe={null}>
          <CardElement id="foo" />
        </Elements>
      );

      const elementContainer = container.firstChild as Element;

      expect(elementContainer.id).toBe('foo');
    });

    it('passes className to the wrapping DOM element', () => {
      const {container} = render(
        <Elements stripe={null}>
          <CardElement className="bar" />
        </Elements>
      );
      const elementContainer = container.firstChild as Element;
      expect(elementContainer).toHaveClass('bar');
    });
  });

  describe('on the server - only for CustomCheckoutProvider', () => {
    const CardElement = createElementComponent('card', true);

    it('does not render anything', () => {
      const {container} = render(
        <CustomCheckoutProvider stripe={null} options={{clientSecret: ''}}>
          <CardElement />
        </CustomCheckoutProvider>
      );

      expect(container.firstChild).toBe(null);
    });
  });

  describe.each([
    ['Elements', Elements, {clientSecret: 'pi_123'}],
    [
      'CustomCheckoutProvider',
      CustomCheckoutProvider,
      {clientSecret: 'cs_123'},
    ],
  ])(
    'on the server with Provider - %s',
    (_providerName, Provider, providerOptions) => {
      const CardElement = createElementComponent('card', true);

      it('gives the element component a proper displayName', () => {
        expect(CardElement.displayName).toBe('CardElement');
      });

      it('stores the element component`s type as a static property', () => {
        expect((CardElement as any).__elementType).toBe('card');
      });

      it('throws when the Element is mounted outside of Elements context', () => {
        // Prevent the console.errors to keep the test output clean
        jest.spyOn(console, 'error');
        (console.error as any).mockImplementation(() => {});

        expect(() => render(<CardElement />)).toThrow(
          'Could not find Elements context; You need to wrap the part of your app that mounts <CardElement> in an <Elements> provider.'
        );
      });

      it('does not call useLayoutEffect', () => {
        render(
          <Provider stripe={null} options={providerOptions}>
            <CardElement />
          </Provider>
        );

        expect(React.useLayoutEffect).not.toHaveBeenCalled();
      });
    }
  );

  describe('on the client', () => {
    const CardElement: CardElementComponent = createElementComponent(
      'card',
      false
    );
    const PaymentRequestButtonElement: PaymentRequestButtonElementComponent = createElementComponent(
      'card',
      false
    );
    const PaymentElement: PaymentElementComponent = createElementComponent(
      'payment',
      false
    );

    const ExpressCheckoutElement: ExpressCheckoutElementComponent = createElementComponent(
      'expressCheckout',
      false
=======
const App = () => {
  const [pk, setPK] = React.useState(
    window.sessionStorage.getItem('react-stripe-js-pk') || ''
  );
  const [clientSecret, setClientSecret] = React.useState(
    window.sessionStorage.getItem('react-stripe-js-embedded-client-secret') ||
      ''
  );

  React.useEffect(() => {
    window.sessionStorage.setItem('react-stripe-js-pk', pk || '');
  }, [pk]);
  React.useEffect(() => {
    window.sessionStorage.setItem(
      'react-stripe-js-embedded-client-secret',
      clientSecret || ''

    );
  }, [clientSecret]);

    it('Can remove and add CardElement at the same time', () => {
      let cardMounted = false;
      mockElement.mount.mockImplementation(() => {
        if (cardMounted) {
          throw new Error('Card already mounted');
        }
        cardMounted = true;
      });
      mockElement.destroy.mockImplementation(() => {
        cardMounted = false;
      });

      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement key={'1'} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <CardElement key={'2'} />
        </Elements>
      );

      expect(mockElement.mount).toHaveBeenCalledTimes(2);
    });

    it('gives the element component a proper displayName', () => {
      expect(CardElement.displayName).toBe('CardElement');
    });

    it('stores the element component`s type as a static property', () => {
      expect((CardElement as any).__elementType).toBe('card');
    });

    it('passes id to the wrapping DOM element', () => {
      const {container} = render(
        <Elements stripe={mockStripe}>
          <CardElement id="foo" />
        </Elements>
      );
      const elementContainer = container.firstChild as Element;

      expect(elementContainer.id).toBe('foo');
    });

    it('passes className to the wrapping DOM element', () => {
      const {container} = render(
        <Elements stripe={mockStripe}>
          <CardElement className="bar" />
        </Elements>
      );
      const elementContainer = container.firstChild as Element;

      expect(elementContainer).toHaveClass('bar');
    });

    it('creates the element with options', () => {
      const options: any = {foo: 'foo'};
      render(
        <Elements stripe={mockStripe}>
          <CardElement options={options} />
        </Elements>
      );

      expect(mockElements.create).toHaveBeenCalledWith('card', options);

      expect(simulateOn).not.toBeCalled();
      expect(simulateOff).not.toBeCalled();
    });

    it('creates, destroys, then re-creates element in strict mode', () => {
      expect.assertions(4);

      let elementCreated = false;

      mockElements.create.mockImplementation(() => {
        expect(elementCreated).toBe(false);
        elementCreated = true;

        return mockElement;
      });

      mockElement.destroy.mockImplementation(() => {
        elementCreated = false;
      });

      render(
        <StrictMode>
          <Elements stripe={mockStripe}>
            <CardElement />
          </Elements>
        </StrictMode>
      );

      expect(mockElements.create).toHaveBeenCalledTimes(2);
      expect(mockElement.destroy).toHaveBeenCalledTimes(1);
    });

    it('mounts the element', () => {
      const {container} = render(
        <Elements stripe={mockStripe}>
          <CardElement />
        </Elements>
      );

      expect(mockElement.mount).toHaveBeenCalledWith(container.firstChild);
      expect(React.useLayoutEffect).toHaveBeenCalled();

      expect(simulateOn).not.toBeCalled();
      expect(simulateOff).not.toBeCalled();
    });

    it('does not create and mount until Elements has been instantiated', () => {
      const {rerender} = render(
        <Elements stripe={null}>
          <CardElement />
        </Elements>
      );

      expect(mockElement.mount).not.toHaveBeenCalled();
      expect(mockElements.create).not.toHaveBeenCalled();

      rerender(
        <Elements stripe={mockStripe}>
          <CardElement />
        </Elements>
      );

      expect(mockElement.mount).toHaveBeenCalled();
      expect(mockElements.create).toHaveBeenCalled();
    });

    it('throws when the Element is mounted outside of Elements context', () => {
      // Prevent the console.errors to keep the test output clean
      jest.spyOn(console, 'error');
      (console.error as any).mockImplementation(() => {});

      expect(() => render(<CardElement />)).toThrow(
        'Could not find Elements context; You need to wrap the part of your app that mounts <CardElement> in an <Elements> provider.'
      );
    });

    it('adds an event handlers to an Element', () => {
      const mockHandler = jest.fn();
      render(
        <Elements stripe={mockStripe}>
          <CardElement onChange={mockHandler} />
        </Elements>
      );

      const changeEventMock = Symbol('change');
      simulateEvent('change', changeEventMock);
      expect(mockHandler).toHaveBeenCalledWith(changeEventMock);
    });

    it('attaches event listeners once the element is created', () => {
      jest
        .spyOn(
          CustomCheckoutModule,
          'useElementsOrCustomCheckoutSdkContextWithUseCase'
        )
        .mockReturnValueOnce({elements: null, stripe: null})
        .mockReturnValue({elements: mockElements, stripe: mockStripe});

      const mockHandler = jest.fn();

      // This won't create the element, since elements is undefined on this render
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement onChange={mockHandler} />
        </Elements>
      );
      expect(mockElements.create).not.toBeCalled();

      expect(simulateOn).not.toBeCalled();

      // This creates the element now that elements is defined
      rerender(
        <Elements stripe={mockStripe}>
          <CardElement onChange={mockHandler} />
        </Elements>
      );
      expect(mockElements.create).toBeCalled();

      expect(simulateOn).toBeCalledWith('change', expect.any(Function));
      expect(simulateOff).not.toBeCalled();

      const changeEventMock = Symbol('change');
      simulateEvent('change', changeEventMock);
      expect(mockHandler).toHaveBeenCalledWith(changeEventMock);
    });

    it('adds event handler on re-render', () => {
      const mockHandler = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement onChange={mockHandler} />
        </Elements>
      );

      expect(simulateOn).toBeCalledWith('change', expect.any(Function));
      expect(simulateOff).not.toBeCalled();

      rerender(
        <Elements stripe={mockStripe}>
          <CardElement />
        </Elements>
      );

      expect(simulateOff).toBeCalledWith('change', expect.any(Function));
    });

    it('removes event handler when removed on re-render', () => {
      const mockHandler = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement onChange={mockHandler} />
        </Elements>
      );

      expect(simulateOn).toBeCalledWith('change', expect.any(Function));
      expect(simulateOff).not.toBeCalled();

      rerender(
        <Elements stripe={mockStripe}>
          <CardElement />
        </Elements>
      );

      expect(simulateOff).toBeCalledWith('change', expect.any(Function));
    });

    it('does not call on/off when an event handler changes', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();

      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement onChange={mockHandler} />
        </Elements>
      );

      expect(simulateOn).toBeCalledWith('change', expect.any(Function));

      rerender(
        <Elements stripe={mockStripe}>
          <CardElement onChange={mockHandler2} />
        </Elements>
      );

      expect(simulateOn).toBeCalledTimes(1);
      expect(simulateOff).not.toBeCalled();
    });

    it('propagates the Element`s ready event to the current onReady prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement onReady={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <CardElement onReady={mockHandler2} />
        </Elements>
      );

      const mockEvent = Symbol('ready');
      simulateEvent('ready', mockEvent);
      expect(mockHandler2).toHaveBeenCalledWith(mockElement);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Express Checkout Element`s ready event to the current onReady prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <ExpressCheckoutElement onReady={mockHandler} onConfirm={() => {}} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <ExpressCheckoutElement onReady={mockHandler2} onConfirm={() => {}} />
        </Elements>
      );

      const mockEvent = Symbol('ready');
      simulateEvent('ready', mockEvent);
      expect(mockHandler2).toHaveBeenCalledWith(mockEvent);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Element`s change event to the current onChange prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement onChange={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <CardElement onChange={mockHandler2} />
        </Elements>
      );

      const changeEventMock = Symbol('change');
      simulateEvent('change', changeEventMock);
      expect(mockHandler2).toHaveBeenCalledWith(changeEventMock);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Element`s blur event to the current onBlur prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement onBlur={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <CardElement onBlur={mockHandler2} />
        </Elements>
      );

      simulateEvent('blur');
      expect(mockHandler2).toHaveBeenCalledWith();
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Element`s focus event to the current onFocus prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement onFocus={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <CardElement onFocus={mockHandler2} />
        </Elements>
      );

      simulateEvent('focus');
      expect(mockHandler2).toHaveBeenCalledWith();
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Element`s escape event to the current onEscape prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement onEscape={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <CardElement onEscape={mockHandler2} />
        </Elements>
      );

      simulateEvent('escape');
      expect(mockHandler2).toHaveBeenCalledWith();
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Element`s click event to the current onClick prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <PaymentRequestButtonElement onClick={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <PaymentRequestButtonElement onClick={mockHandler2} />
        </Elements>
      );

      const clickEventMock = Symbol('click');
      simulateEvent('click', clickEventMock);
      expect(mockHandler2).toHaveBeenCalledWith(clickEventMock);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Element`s loaderror event to the current onLoadError prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <PaymentElement onLoadError={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <PaymentElement onLoadError={mockHandler2} />
        </Elements>
      );

      const loadErrorEventMock = Symbol('loaderror');
      simulateEvent('loaderror', loadErrorEventMock);
      expect(mockHandler2).toHaveBeenCalledWith(loadErrorEventMock);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Element`s loaderstart event to the current onLoaderStart prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <PaymentElement onLoaderStart={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <PaymentElement onLoaderStart={mockHandler2} />
        </Elements>
      );

      simulateEvent('loaderstart');
      expect(mockHandler2).toHaveBeenCalledWith();
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Element`s networkschange event to the current onNetworksChange prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <CardElement onNetworksChange={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <CardElement onNetworksChange={mockHandler2} />
        </Elements>
      );

      simulateEvent('networkschange');
      expect(mockHandler2).toHaveBeenCalledWith();
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Element`s confirm event to the current onConfirm prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <ExpressCheckoutElement onConfirm={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <ExpressCheckoutElement onConfirm={mockHandler2} />
        </Elements>
      );

      const confirmEventMock = Symbol('confirm');
      simulateEvent('confirm', confirmEventMock);
      expect(mockHandler2).toHaveBeenCalledWith(confirmEventMock);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('propagates the Element`s cancel event to the current onCancel prop', () => {
      const mockHandler = jest.fn();
      const mockHandler2 = jest.fn();
      const {rerender} = render(
        <Elements stripe={mockStripe}>
          <ExpressCheckoutElement onConfirm={() => {}} onCancel={mockHandler} />
        </Elements>
      );
      rerender(
        <Elements stripe={mockStripe}>
          <ExpressCheckoutElement
            onConfirm={() => {}}
            onCancel={mockHandler2}
          />
        </Elements>
      );

      const cancelEventMock = Symbol('cancel');
      simulateEvent('cancel', cancelEventMock);
      expect(mockHandler2).toHaveBeenCalledWith(cancelEventMock);
      expect(mockHandler).not.toHaveBeenCalled();
    });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUnload = () => {
    setStripePromise(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          CheckoutSession client_secret
          <input
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
          />
        </label>
        <label>
          Publishable key{' '}
          <input value={pk} onChange={(e) => setPK(e.target.value)} />
        </label>
        <button style={{marginRight: 10}} type="submit">
          Load
        </button>
        <button type="button" onClick={handleUnload}>
          Unload
        </button>
      </form>
      {stripePromise && clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{clientSecret}}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </>
  );
};

export default App;
