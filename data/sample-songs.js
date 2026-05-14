/**
 * OpenFret sample songs.
 *
 * Every song in this file is in the public domain in the United States
 * (composed before 1929 or a traditional folk song with no known author).
 * They are bundled so first-run users see a populated library instead of
 * an empty state. Users can hide them or replace them at any time.
 *
 * Field reference:
 *   id        unique string id (used by the library)
 *   title     song title
 *   artist    composer or "Traditional"
 *   genre     folk | blues | jazz | rock-arrangement
 *   chords    quick-glance chord summary
 *   lyrics    full lyrics with chord brackets like [Am]
 *   youtube   optional youtube search url for the "ORIGINAL" button
 *   license   "Public Domain" with brief justification
 *   sample    true (marks this as a built-in sample, not a user song)
 */
window.OPENFRET_SAMPLE_SONGS = [
    {
        id: "sample-amazing-grace",
        title: "Amazing Grace",
        artist: "John Newton (Traditional)",
        genre: "folk",
        chords: "G C D Em",
        lyrics: `[G]Amazing [G7]grace, how [C]sweet the [G]sound,
That [G]saved a [Em]wretch like [D]me.
I [G]once was [G7]lost, but [C]now am [G]found,
Was [Em]blind, but [D]now I [G]see.

'Twas [G]grace that [G7]taught my [C]heart to [G]fear,
And [G]grace my [Em]fears re[D]lieved.
How [G]precious [G7]did that [C]grace ap[G]pear,
The [Em]hour I [D]first be[G]lieved.

Through [G]many [G7]dangers, [C]toils and [G]snares,
I [G]have al[Em]ready [D]come.
'Tis [G]grace hath [G7]brought me [C]safe thus [G]far,
And [Em]grace will [D]lead me [G]home.

When [G]we've been [G7]there ten [C]thousand [G]years,
Bright [G]shining [Em]as the [D]sun,
We've [G]no less [G7]days to [C]sing God's [G]praise,
Than [Em]when we'd [D]first be[G]gun.`,
        youtube: "https://www.youtube.com/results?search_query=amazing+grace+guitar",
        license: "Public Domain (lyrics 1779, traditional melody)",
        sample: true
    },
    {
        id: "sample-house-rising-sun",
        title: "House of the Rising Sun",
        artist: "Traditional",
        genre: "folk",
        chords: "Am C D F E",
        lyrics: `[Am]There is a [C]house in [D]New Or[F]leans
They [Am]call the [C]Rising [E]Sun
And it's [Am]been the [C]ruin of [D]many a poor [F]boy
And [Am]God, I [E]know I'm [Am]one

My [Am]mother [C]was a [D]tailor[F]
She [Am]sewed my [C]new blue [E]jeans
My [Am]father was a [C]gambling [D]man[F]
Down in [Am]New Or[E]leans

Now the [Am]only [C]thing a [D]gambler [F]needs
Is a [Am]suitcase [C]and a [E]trunk
And the [Am]only [C]time he's [D]satis[F]fied
Is [Am]when he's [E]on a [Am]drunk

Oh [Am]mother, [C]tell your [D]child[F]ren
Not to [Am]do what [C]I have [E]done
Spend your [Am]lives in [C]sin and [D]misery[F]
In the [Am]House of the [E]Rising [Am]Sun

Well, I've [Am]got one [C]foot on the [D]platform[F]
The [Am]other foot [C]on the [E]train
I'm [Am]going [C]back to [D]New Or[F]leans
To [Am]wear that [E]ball and [Am]chain`,
        youtube: "https://www.youtube.com/results?search_query=house+of+the+rising+sun+animals",
        license: "Public Domain (traditional folk song, origins pre-1900)",
        sample: true
    },
    {
        id: "sample-scarborough-fair",
        title: "Scarborough Fair",
        artist: "Traditional English",
        genre: "folk",
        chords: "Am C G D Em",
        lyrics: `[Am]Are you going to [G]Scarborough [Am]Fair?
[Am]Parsley, [C]sage, rose[D]mary and [Am]thyme
[Am]Remember me to [C]one who lives [G]there
For [Em]she once [Am]was a true love of [Am]mine

[Am]Tell her to make me a [G]cambric [Am]shirt
[Am]Parsley, [C]sage, rose[D]mary and [Am]thyme
[Am]Without no seam nor [C]fine needle[G]work
[Em]Then she'll [Am]be a true love of [Am]mine

[Am]Tell her to find me an [G]acre of [Am]land
[Am]Parsley, [C]sage, rose[D]mary and [Am]thyme
[Am]Between the salt water [C]and the sea [G]strand
[Em]Then she'll [Am]be a true love of [Am]mine

[Am]Tell her to reap it with a [G]sickle of [Am]leather
[Am]Parsley, [C]sage, rose[D]mary and [Am]thyme
[Am]And gather it all in a [C]bunch of [G]heather
[Em]Then she'll [Am]be a true love of [Am]mine`,
        youtube: "https://www.youtube.com/results?search_query=scarborough+fair+guitar",
        license: "Public Domain (traditional English ballad, origins 16th century)",
        sample: true
    },
    {
        id: "sample-auld-lang-syne",
        title: "Auld Lang Syne",
        artist: "Robert Burns (Traditional)",
        genre: "folk",
        chords: "G C D Em",
        lyrics: `Should [G]old ac[D]quaintance [G]be for[C]got,
And [G]never brought to [D]mind?
Should [G]old ac[D]quaintance [G]be for[C]got,
And [G]days of [D]auld lang [G]syne?

For [G]auld lang [D]syne, my [G]dear,
For [G]auld lang [D]syne.
We'll [G]take a cup of [D]kindness [G]yet,
For [Em]auld [D]lang [G]syne.

We [G]two have [D]run about the [C]braes,
And [G]picked the [D]daisies [G]fine.
But we've [G]wandered [D]many a weary [C]foot,
Since [G]auld [D]lang [G]syne.

We [G]two have [D]paddled in the [C]stream,
From [G]morning sun till [D]dine.
But [G]seas be[D]tween us broad have [C]roared,
Since [G]auld [D]lang [G]syne.`,
        youtube: "https://www.youtube.com/results?search_query=auld+lang+syne+guitar",
        license: "Public Domain (lyrics by Robert Burns, 1788)",
        sample: true
    },
    {
        id: "sample-oh-susanna",
        title: "Oh! Susanna",
        artist: "Stephen Foster",
        genre: "folk",
        chords: "G C D D7",
        lyrics: `I [G]come from Alabama with my [G]banjo on my [D]knee
I'm [G]going to Louisi[C]ana, my true [G]love for to [D]see
It [G]rained all night the day I left, the [G]weather it was [D]dry
The [G]sun so hot I [C]froze to death, Su[G]sanna, [D]don't you [G]cry

Oh! Su[C]sanna, oh, [G]don't you cry for [D]me
For I [G]come from Ala[C]bama with my [G]banjo [D]on my [G]knee

I [G]had a dream the other night when [G]everything was [D]still
I [G]thought I saw Su[C]sanna a-coming [G]down the [D]hill
The [G]buckwheat cake was in her mouth, the [G]tear was in her [D]eye
Says [G]I, "I'm coming [C]from the South, Su[G]sanna, [D]don't you [G]cry"

Oh! Su[C]sanna, oh, [G]don't you cry for [D]me
For I [G]come from Ala[C]bama with my [G]banjo [D]on my [G]knee`,
        youtube: "https://www.youtube.com/results?search_query=oh+susanna+stephen+foster+guitar",
        license: "Public Domain (Stephen Foster, 1848)",
        sample: true
    },
    {
        id: "sample-st-louis-blues",
        title: "St. Louis Blues",
        artist: "W.C. Handy",
        genre: "blues",
        chords: "G G7 C C7 D7 (12-bar)",
        lyrics: `[G]I hate to see the [G7]evening sun go [C]down
[C7]I hate to see the [G]evening sun go [G7]down
'Cause my [D7]baby, she done left this [G]town

[G]Feeling tomorrow [G7]like I feel to[C]day
[C7]If I feel tomorrow [G]like I feel to[G7]day
Gonna [D7]pack my trunk and make my get[G]away

[G]St. Louis woman with her [G7]diamond [C]rings
[C7]Pulls that man around [G]by her apron [G7]strings
[D7]'Twasn't for powder and her store-bought [G]hair
That [D7]man I love wouldn't go nowhere, no[G]where

[G]Got the St. Louis [G7]blues, just as blue as I can [C]be
[C7]That man's got a heart like a [G]rock cast in the [G7]sea
Or [D7]else he wouldn't have gone so far from [G]me`,
        youtube: "https://www.youtube.com/results?search_query=st+louis+blues+wc+handy+guitar",
        license: "Public Domain (W.C. Handy, 1914)",
        sample: true
    },
    {
        id: "sample-st-james-infirmary",
        title: "St. James Infirmary",
        artist: "Traditional",
        genre: "blues",
        chords: "Am Dm E7",
        lyrics: `I [Am]went down to [Dm]St. James In[Am]firmary
[Am]Saw my baby [E7]there
[Am]Stretched out on a [Dm]long white [Am]table
So [Am]cold, so [E7]still, so [Am]fair

Let her [Am]go, let her [Dm]go, God [Am]bless her
Wher[Am]ever she may [E7]be
She can [Am]search this wide [Dm]world o[Am]ver
She'll never [E7]find another sweet man like [Am]me

When [Am]I die, please [Dm]bury me in my [Am]high-top Stetson hat
[Am]Put a gold piece on my [E7]watch chain
So they'll [Am]know I died [Dm]standing [Am]pat

Get [Am]six gamblers to [Dm]carry my [Am]coffin
[Am]Six chorus girls to [E7]sing me a song
[Am]Put a jazz band [Dm]on my [Am]hearse wagon
To [E7]raise hell as we go a[Am]long`,
        youtube: "https://www.youtube.com/results?search_query=st+james+infirmary+blues+guitar",
        license: "Public Domain (traditional, published versions by 1928)",
        sample: true
    },
    {
        id: "sample-nobody-knows",
        title: "Nobody Knows You When You're Down and Out",
        artist: "Jimmy Cox",
        genre: "blues",
        chords: "C E7 A7 D7 G7",
        lyrics: `[C]Once I lived the life of a [E7]millionaire
[A7]Spent all my money, I just did not [D7]care
[G7]Took all my friends out for a mighty good [C]time
We bought [E7]bootleg whiskey, [A7]champagne and [D7]wine

[C]Then I began to fall so [E7]low
[A7]Lost all my good friends, had no place to [D7]go
[G7]If I get my hands on a dollar a[C]gain
I'm gonna [E7]hold on to it [A7]till that [D7]eagle [G7]grins

'Cause [C]nobody knows you when you're [E7]down and out
[A7]In your pocket, not one [D7]penny
And as for [G7]friends, you don't have a[C]ny

When you [C]finally get back upon your [E7]feet again
[A7]Everybody wants to be your long-lost [D7]friend
[G7]Said it straight, without a [C]doubt
[E7]Nobody [A7]knows you when you're [D7]down and [G7]out`,
        youtube: "https://www.youtube.com/results?search_query=nobody+knows+you+when+youre+down+and+out+guitar",
        license: "Public Domain (Jimmy Cox, 1923)",
        sample: true
    },
    {
        id: "sample-saints",
        title: "When the Saints Go Marching In",
        artist: "Traditional",
        genre: "jazz",
        chords: "C C7 F G7",
        lyrics: `Oh [C]when the saints go marching in
Oh when the [G7]saints go marching in
Oh how I [C]want to be in that [C7]number
When the [F]saints [G7]go marching [C]in

And [C]when the sun refuse to shine
And when the [G7]sun refuse to shine
Oh how I [C]want to be in that [C7]number
When the [F]sun [G7]refuse to [C]shine

And [C]when the moon turns red with blood
And when the [G7]moon turns red with blood
Oh how I [C]want to be in that [C7]number
When the [F]moon [G7]turns red with [C]blood

Oh [C]when the trumpet sounds its call
Oh when the [G7]trumpet sounds its call
Oh how I [C]want to be in that [C7]number
When the [F]trumpet [G7]sounds its [C]call`,
        youtube: "https://www.youtube.com/results?search_query=when+the+saints+go+marching+in+guitar",
        license: "Public Domain (traditional American spiritual)",
        sample: true
    },
    {
        id: "sample-sweet-georgia-brown",
        title: "Sweet Georgia Brown",
        artist: "Bernie, Pinkard & Casey",
        genre: "jazz",
        chords: "D7 G7 C7 F",
        lyrics: `No [D7]gal made has got a shade on Sweet Georgia Brown
[G7]Two left feet, but oh so neat has Sweet Georgia Brown
[C7]They all sigh and want to die for Sweet Georgia Brown
I'll [F]tell you just why, you know I don't lie, not much

It's been [D7]said she knocks 'em dead when she lands in town
[G7]Since she came, why it's a shame how she cools 'em down
[C7]Fellas she can't get must be fellas she ain't met
[F]Georgia claimed her, Georgia named her Sweet Georgia Brown

[D7]All those tips the porter slips to Sweet Georgia Brown
[G7]They buy clothes at fashion shows for Sweet Georgia Brown
[C7]Men, they bow to her every wish, they yes ma'am her
[F]Just because she's Sweet Georgia Brown`,
        youtube: "https://www.youtube.com/results?search_query=sweet+georgia+brown+guitar",
        license: "Public Domain (Bernie, Pinkard & Casey, 1925)",
        sample: true
    }
];

// Backward-compat alias so legacy code expecting OPENFRET_SONGS still works
// before the library layer merges samples + user songs.
window.OPENFRET_SONGS = window.OPENFRET_SAMPLE_SONGS;
