describe('Search', function() {

    var list, jonny, martina, angelica, sebastian, imma, hasse;

    before(function() {
        list = fixture.list(['name', 'born'], fixture.all);

        jonny = list.get('name', 'Jonny Strömberg')[0];
        martina = list.get('name', 'Martina Elm')[0];
        angelica = list.get('name', 'Angelica Abraham')[0];
        sebastian = list.get('name', 'Sebastian Höglund')[0];
        imma = list.get('name', 'Imma Grafström')[0];
        hasse = list.get('name', 'Hasse Strömberg')[0];
    });

    after(function() {
        fixture.removeList();
    });

    afterEach(function() {
        list.search();
        list.show(1, 200);
    })

    describe('Case-sensitive', function() {
        it('should not be case-sensitive', function() {
            var result = list.search('jonny');
            expect(result.length).to.equal(1);
            expect(result[0]).to.deep.equal(jonny);
        });
    });

    describe('Number of results', function() {
        it('should find jonny, martina, angelice', function() {
            var result = list.search('1986');
            expect(result.length).to.equal(3); // 3!!
            expect(jonny.matching()).to.be.true;
            expect(martina.matching()).to.be.true;
            expect(angelica.matching()).to.be.true;
            expect(sebastian.matching()).to.be.false;
            expect(imma.matching()).to.be.false;
            expect(hasse.matching()).to.be.false;
            list.search();
        });
        it('should find all with utf-8 char ö', function() {
            var result = list.search('ö');
            expect(result.length).to.equal(4); // 4!!
            expect(jonny.matching()).to.be.true;
            expect(martina.matching()).to.be.false;
            expect(angelica.matching()).to.be.false;
            expect(sebastian.matching()).to.be.true;
            expect(imma.matching()).to.be.true;
            expect(hasse.matching()).to.be.true;
        });
    });

    describe('Specfic columns', function() {
        it('should find match in column', function() {
            var result = list.search('jonny', { name: true });
            expect(result.length).to.equal(1);
            expect(result[0]).to.deep.equal(jonny);
        });
        it('should not find match in column', function() {
            var result = list.search('jonny', { born: true });
            expect(result.length).to.equal(0);
        });
        it('should find match in column', function() {
            var result = list.search('jonny', [ 'name' ]);
            expect(result.length).to.equal(1);
            expect(result[0]).to.deep.equal(jonny);
        });
        it('should not find match in column', function() {
            var result = list.search('jonny', [ 'born' ]);
            expect(result.length).to.equal(0);
        });
    });
});