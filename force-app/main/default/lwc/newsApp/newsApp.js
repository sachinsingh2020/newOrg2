import { LightningElement, track } from 'lwc';
import fetchNewsData from "@salesforce/apex/NewsController.fetchNewsData";

export default class NewsApp extends LightningElement {
    @track pageNumber = 1;
    @track category = 'sports';
    @track resultArray = [];
    @track totalResults = 0;
    @track disableNext = false;
    @track isLoading = false;

    categories = [
        { label: 'Sports', value: 'sports' },
        { label: 'Technology', value: 'technology' },
        { label: 'Finance', value: 'finance' },
        { label: 'Health', value: 'health' },
        { label: 'India', value: 'india' },
        { label: 'Politics', value: 'politics' },
        { label: 'Entertainment', value: 'entertainment' }
    ];

    connectedCallback() {
        this.callTheApi();
    }

    // Getter for result visibility
    get hasResults() {
        return this.resultArray && this.resultArray.length > 0;
    }

    // Getters for button disabled states
    get isPrevDisabled() {
        return this.pageNumber === 1 || this.isLoading;
    }

    get isNextDisabled() {
        return this.disableNext || this.isLoading;
    }

    handleCategoryChange(event) {
        this.category = event.detail.value;
        this.pageNumber = 1;
        this.callTheApi();
    }

    handleNext() {
        this.pageNumber++;
        this.callTheApi();
    }

    handlePrev() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.callTheApi();
        }
    }

    callTheApi() {
        this.isLoading = true;
        this.disableNext = false;

        fetchNewsData({ category: this.category, pageNumber: this.pageNumber })
            .then((result) => {
                this.totalResults = result.totalResults || 0;

                const PROXY_URL = 'https://images.weserv.nl/?url=';

                this.resultArray = (result.articles || []).map(article => {
                    let img = article.urlToImage;

                    if (!img || !img.startsWith('http')) {
                        img = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                    }

                    return {
                        ...article,
                        proxyImage: PROXY_URL + encodeURIComponent(img)
                    };
                });

                // Disable next button if no more pages
                let maxPages = Math.ceil(this.totalResults / 10);
                this.disableNext = this.pageNumber >= maxPages;
            })
            .catch((error) => {
                console.error('❌ Error fetching news:', error);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleImageError(event) {
        event.target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
    }
}
