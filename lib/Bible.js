export default class Bible {

    base = 'https://api.scripture.api.bible'
    key = 'b1d5c6581864222275f4cb843c29d4fa'

    static types = new Map([['Yoruba' , 'b8d1feac6e94bd74-01'],['KJV' , 'de4e12af7f28f599-01'],
    ['Arabic' , 'b17e246951402e50-01'],['Igbo' , '0ab0c764d56a715d-01'],['Geneva Bible' , 'c315fa9f71d4af3a-01'],
    ['The Holy Bible, American Standard Version' , '06125adad2d5898a-01']])

    async getBooks(id) {
        const response = await fetch(this.base+'/v1/bibles/'+id+'/books',
            {headers: {'api-key': this.key}
        })
        return await response.json()
    }
    
    async getBook(bibleId,bookId) {
        const response = await fetch(this.base+'/v1/bibles/'+bibleId+'/books/'+bookId,
            {headers: {'api-key': this.key}
        })
        return await response.json()
    }

    async getChapters(bibleId,bookId) {
        const response = await fetch(this.base+'/v1/bibles/'+bibleId+'/books/'+bookId+'/chapters',
            {headers: {'api-key': this.key}
        })
        return await response.json()
    }

    async getVerses(bibleId,chapterId) {
        const response = await fetch(this.base+'/v1/bibles/'+bibleId+'/chapters/'+chapterId+'/verses',
            {headers: {'api-key': this.key}
        })
        return await response.json()
    }

    async getChapter(bibleId,chapterId) {
        const response = await fetch(this.base+'/v1/bibles/'+bibleId+'/chapters/'+chapterId,
            {headers: {'api-key': this.key}
        })
        return await response.json()
    }

    async getVerse(bibleId,verseId) {
        const response = await fetch(this.base+'/v1/bibles/'+bibleId+'/verses/'+verseId,
            {headers: {'api-key': this.key}
        })
        return await response.json()
    }
}
