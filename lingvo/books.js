/* Книги «Лингво»: адаптированные пересказы классики из общественного
   достояния (тексты пересказаны для приложения простым языком под уровень).
   chapters — главы из пар «предложение | перевод»;
   gloss — мини-словарь трудных слов книги, которых может не быть в основном словаре.
   QUOTES — известные цитаты и пословицы с переводом. */
const BOOKS = [
{ id: "b-aesop", lvl: "A1", title: "Fables", author: "Aesop · адаптация", about: "Короткие басни с моралью: лев и мышь, черепаха и заяц, лиса и виноград.",
  chapters: [
  { t: "The Lion and the Mouse", pairs: [
    ["A big lion was sleeping under a tree.", "Большой лев спал под деревом."],
    ["A little mouse ran over his nose.", "Маленькая мышка пробежала по его носу."],
    ["The lion woke up and caught the mouse.", "Лев проснулся и поймал мышку."],
    ["'Please don't eat me!' said the mouse. 'One day I can help you.'", "«Пожалуйста, не ешь меня! — сказала мышка. — Однажды я смогу тебе помочь»."],
    ["The lion laughed, but he let the mouse go.", "Лев рассмеялся, но отпустил мышку."],
    ["A few days later, hunters caught the lion in a net.", "Через несколько дней охотники поймали льва в сеть."],
    ["The lion roared, but he could not get out.", "Лев рычал, но не мог выбраться."],
    ["The little mouse heard him and ran to help.", "Маленькая мышка услышала его и прибежала на помощь."],
    ["She bit the net with her small teeth until there was a big hole.", "Она грызла сеть своими маленькими зубами, пока не получилась большая дыра."],
    ["The lion was free. Even a small friend can be a great friend.", "Лев был свободен. Даже маленький друг может быть большим другом."]] },
  { t: "The Tortoise and the Hare", pairs: [
    ["A hare always laughed at a tortoise because he was so slow.", "Заяц всегда смеялся над черепахой, потому что она была такой медленной."],
    ["One day the tortoise said, 'Let's have a race.'", "Однажды черепаха сказала: «Давай устроим гонку»."],
    ["The hare laughed and agreed.", "Заяц засмеялся и согласился."],
    ["The race started, and the hare ran very fast.", "Гонка началась, и заяц побежал очень быстро."],
    ["Soon he was far ahead, so he decided to sleep a little.", "Скоро он был далеко впереди и решил немного поспать."],
    ["The tortoise walked slowly, but he never stopped.", "Черепаха шла медленно, но ни разу не остановилась."],
    ["When the hare woke up, the tortoise was near the finish.", "Когда заяц проснулся, черепаха была уже у финиша."],
    ["The hare ran as fast as he could, but it was too late.", "Заяц побежал изо всех сил, но было слишком поздно."],
    ["The tortoise won the race. Slow and steady wins the race.", "Черепаха выиграла гонку. Тише едешь — дальше будешь."]] },
  { t: "The Fox and the Grapes", pairs: [
    ["One hot day a hungry fox saw some grapes on a high branch.", "Однажды в жаркий день голодная лиса увидела виноград на высокой ветке."],
    ["The grapes looked sweet and juicy.", "Виноград выглядел сладким и сочным."],
    ["The fox jumped, but she could not reach them.", "Лиса прыгнула, но не смогла их достать."],
    ["She jumped again and again, but the grapes were too high.", "Она прыгала снова и снова, но виноград висел слишком высоко."],
    ["At last she was tired and walked away.", "Наконец она устала и ушла."],
    ["'Those grapes are sour,' she said. 'I don't want them anyway.'", "«Этот виноград кислый, — сказала она. — Он мне всё равно не нужен»."],
    ["It is easy to say you don't want something you can't have.", "Легко сказать, что тебе не нужно то, чего ты не можешь получить."]] }],
  gloss: { woke: "проснулся (wake)", caught: "поймал (catch)", few: "несколько (a few)", fox: "лиса", lion: "лев", mouse: "мышь", hunters: "охотники", net: "сеть", roared: "зарычал", bit: "укусила, грызла", hole: "дыра", hare: "заяц", tortoise: "черепаха", race: "гонка, забег", ahead: "впереди", finish: "финиш", steady: "упорный, равномерный", grapes: "виноград", branch: "ветка", juicy: "сочный", reach: "дотянуться", sour: "кислый", anyway: "всё равно" } },

{ id: "b-prince", lvl: "A2", title: "The Happy Prince", author: "Oscar Wilde · адаптация", about: "Статуя принца и ласточка помогают бедным людям города. Грустная и добрая сказка.",
  chapters: [
  { t: "The Statue and the Swallow", pairs: [
    ["High above the city stood the statue of the Happy Prince.", "Высоко над городом стояла статуя Счастливого Принца."],
    ["He was covered with gold, his eyes were two blue jewels, and a red ruby was on his sword.", "Он был покрыт золотом, его глаза были двумя синими камнями, а на его шпаге был красный рубин."],
    ["Everybody in the city admired him.", "Все в городе им восхищались."],
    ["One night a little swallow flew over the city.", "Однажды ночью над городом пролетала маленькая ласточка."],
    ["His friends had already gone to Egypt for the winter, but he was late.", "Его друзья уже улетели в Египет на зиму, а он опоздал."],
    ["He decided to sleep between the feet of the statue.", "Он решил переночевать у ног статуи."],
    ["Suddenly a big drop of water fell on him, then another one.", "Вдруг на него упала большая капля воды, потом ещё одна."],
    ["The swallow looked up. The Happy Prince was crying.", "Ласточка подняла глаза. Счастливый Принц плакал."]] },
  { t: "The Prince's Request", pairs: [
    ["'Why are you crying?' asked the swallow.", "«Почему ты плачешь?» — спросила ласточка."],
    ["'When I was alive, I lived in a palace and never saw sadness,' said the Prince.", "«Когда я был жив, я жил во дворце и никогда не видел печали», — сказал Принц."],
    ["'Now I stand so high that I can see all the poverty of my city.'", "«Теперь я стою так высоко, что вижу всю бедность моего города»."],
    ["'In a small house there is a poor woman. Her son is ill and she has no money for oranges.'", "«В маленьком доме живёт бедная женщина. Её сын болен, а у неё нет денег на апельсины»."],
    ["'Little swallow, will you take her the ruby from my sword?'", "«Ласточка, отнесёшь ей рубин с моей шпаги?»"],
    ["The swallow wanted to fly to Egypt, but he felt sorry for the Prince.", "Ласточка хотела лететь в Египет, но ей стало жаль Принца."],
    ["He took the ruby and flew over the roofs to the poor woman's house.", "Она взяла рубин и полетела над крышами к дому бедной женщины."],
    ["'It is strange,' said the swallow later. 'It is so cold, but I feel warm.'", "«Странно, — сказала ласточка потом. — Так холодно, а мне тепло»."]] },
  { t: "Winter", pairs: [
    ["Every day the Prince asked the swallow to stay one more day.", "Каждый день Принц просил ласточку остаться ещё на день."],
    ["The swallow gave his blue eyes to a poor writer and a little girl.", "Ласточка отдала его синие глаза бедному писателю и маленькой девочке."],
    ["Now the Prince was blind, so the swallow decided to stay with him forever.", "Теперь Принц был слеп, и ласточка решила остаться с ним навсегда."],
    ["He took the gold from the statue, piece by piece, and gave it to the poor.", "Она снимала золото со статуи, кусочек за кусочком, и отдавала бедным."],
    ["Then the snow came, and the swallow grew colder and colder.", "Потом пошёл снег, и ласточке становилось всё холоднее."],
    ["He kissed the Prince and fell dead at his feet.", "Она поцеловала Принца и упала мёртвой у его ног."],
    ["At that moment the Prince's lead heart broke in two.", "В этот момент свинцовое сердце Принца раскололось надвое."],
    ["People said the statue was ugly now, but the two most precious things in the city were his heart and the dead bird.", "Люди говорили, что статуя теперь уродлива, но двумя самыми драгоценными вещами в городе были его сердце и мёртвая птица."]] }],
  gloss: { flew: "полетела (fly)", feet: "ноги, ступни (foot)", sorry: "жаль; извини", writer: "писатель", statue: "статуя", prince: "принц", gold: "золото", jewels: "драгоценные камни", ruby: "рубин", sword: "шпага, меч", admired: "восхищались", swallow: "ласточка", egypt: "Египет", drop: "капля", palace: "дворец", sadness: "печаль", poverty: "бедность", roofs: "крыши", blind: "слепой", piece: "кусок", lead: "свинец; свинцовый", precious: "драгоценный", kissed: "поцеловала" } },

{ id: "b-magi", lvl: "A2", title: "The Gift of the Magi", author: "O. Henry · адаптация", about: "Бедная молодая пара хочет сделать друг другу подарки на Рождество. История с неожиданным концом.",
  chapters: [
  { t: "One Dollar and Eighty-Seven Cents", pairs: [
    ["Della counted her money three times. She had one dollar and eighty-seven cents.", "Делла трижды пересчитала деньги. У неё был один доллар восемьдесят семь центов."],
    ["Tomorrow was Christmas, and she wanted to buy a present for her husband, Jim.", "Завтра было Рождество, и она хотела купить подарок мужу, Джиму."],
    ["They were young and very poor, but they loved each other.", "Они были молоды и очень бедны, но любили друг друга."],
    ["They had only two treasures.", "У них было только два сокровища."],
    ["One was Jim's gold watch, which belonged to his father and grandfather.", "Первое — золотые часы Джима, которые принадлежали его отцу и деду."],
    ["The other was Della's beautiful long hair.", "Второе — красивые длинные волосы Деллы."],
    ["Della looked in the mirror for a long time. Then she put on her old coat and went out.", "Делла долго смотрела в зеркало. Потом надела старое пальто и вышла."],
    ["She sold her hair for twenty dollars and bought a simple gold chain for Jim's watch.", "Она продала свои волосы за двадцать долларов и купила простую золотую цепочку для часов Джима."]] },
  { t: "The Gifts", pairs: [
    ["At seven o'clock Jim came home. He stopped at the door and looked at Della.", "В семь часов Джим пришёл домой. Он остановился в дверях и посмотрел на Деллу."],
    ["'Don't look at me like that,' she said. 'I sold my hair. It will grow again.'", "«Не смотри на меня так, — сказала она. — Я продала волосы. Они снова отрастут»."],
    ["Jim slowly took a small box from his pocket and gave it to her.", "Джим медленно достал из кармана маленькую коробочку и отдал ей."],
    ["Inside there were beautiful combs for her long hair — the combs she had wanted for years.", "Внутри были красивые гребни для её длинных волос — гребни, о которых она мечтала годами."],
    ["Della smiled through her tears and gave him the chain.", "Делла улыбнулась сквозь слёзы и отдала ему цепочку."],
    ["'Give me your watch,' she said. 'I want to see how it looks.'", "«Дай мне свои часы, — сказала она. — Хочу посмотреть, как это выглядит»."],
    ["Jim sat down and smiled. 'I sold the watch to buy your combs.'", "Джим сел и улыбнулся: «Я продал часы, чтобы купить тебе гребни»."],
    ["They gave each other the most valuable things they had. They were the wisest of all who give gifts.", "Они отдали друг другу самое ценное, что у них было. Они были мудрее всех, кто дарит подарки."]] }],
  gloss: { "eighty-seven": "восемьдесят семь", gold: "золото; золотой", counted: "посчитала", cents: "центы", christmas: "Рождество", present: "подарок", treasures: "сокровища", belonged: "принадлежали", grandfather: "дедушка", chain: "цепочка", combs: "гребни", tears: "слёзы", valuable: "ценный", wisest: "мудрейшие", gifts: "подарки", magi: "волхвы" } },

{ id: "b-alice", lvl: "B1", title: "Alice in Wonderland", author: "Lewis Carroll · адаптация", about: "Алиса падает в кроличью нору и попадает в странный мир, где ничего не подчиняется логике.",
  chapters: [
  { t: "Down the Rabbit Hole", pairs: [
    ["Alice was sitting by the river with her sister and was getting very bored.", "Алиса сидела у реки с сестрой, и ей становилось очень скучно."],
    ["Suddenly a White Rabbit with pink eyes ran past her.", "Вдруг мимо неё пробежал Белый Кролик с розовыми глазами."],
    ["There was nothing unusual about that, but then the Rabbit took a watch out of his pocket.", "В этом не было ничего необычного, но потом Кролик достал из кармана часы."],
    ["'Oh dear! Oh dear! I shall be too late!' he said, and hurried on.", "«Ой-ой-ой! Я опоздаю!» — сказал он и поспешил дальше."],
    ["Burning with curiosity, Alice ran after him and saw him jump into a large rabbit hole.", "Сгорая от любопытства, Алиса побежала за ним и увидела, как он прыгнул в большую кроличью нору."],
    ["Without thinking, she jumped in after him.", "Не раздумывая, она прыгнула за ним."],
    ["She fell for a very long time, past cupboards and shelves full of books and jars.", "Она падала очень долго, мимо шкафов и полок, полных книг и банок."],
    ["At last she landed on a pile of leaves, not hurt at all.", "Наконец она приземлилась на кучу листьев, совсем не ушибившись."]] },
  { t: "Drink Me", pairs: [
    ["Alice found herself in a long hall with many locked doors.", "Алиса оказалась в длинном зале со множеством запертых дверей."],
    ["On a glass table there was a tiny golden key.", "На стеклянном столике лежал крошечный золотой ключ."],
    ["It opened a little door behind a curtain, and through it she saw the most beautiful garden.", "Он открыл маленькую дверцу за занавеской, и за ней она увидела прекраснейший сад."],
    ["But the door was so small that she couldn't even get her head through it.", "Но дверца была такой маленькой, что она не могла просунуть в неё даже голову."],
    ["Then she noticed a bottle with a label that said 'DRINK ME'.", "Потом она заметила бутылочку с ярлыком «ВЫПЕЙ МЕНЯ»."],
    ["She tasted it carefully. It tasted of cherry pie, custard and roast turkey.", "Она осторожно попробовала. На вкус это было как вишнёвый пирог, заварной крем и жареная индейка."],
    ["In a moment she was only ten inches high.", "Через мгновение её рост был всего двадцать пять сантиметров."],
    ["But she had left the key on the table, and now it was far too high to reach!", "Но ключ она оставила на столе, и теперь до него было никак не дотянуться!"],
    ["'Curiouser and curiouser!' cried Alice.", "«Всё чудесатее и чудесатее!» — воскликнула Алиса."]] },
  { t: "The Cheshire Cat", pairs: [
    ["Later, Alice met a cat sitting in a tree and grinning from ear to ear.", "Позже Алиса встретила кота, который сидел на дереве и улыбался до ушей."],
    ["'Would you tell me, please, which way I ought to go from here?' she asked.", "«Скажите, пожалуйста, куда мне отсюда идти?» — спросила она."],
    ["'That depends a good deal on where you want to get to,' said the Cat.", "«Это во многом зависит от того, куда ты хочешь попасть», — сказал Кот."],
    ["'I don't much care where,' said Alice.", "«Мне почти всё равно куда», — сказала Алиса."],
    ["'Then it doesn't matter which way you go,' said the Cat.", "«Тогда всё равно, куда идти», — сказал Кот."],
    ["'But I don't want to go among mad people,' Alice said.", "«Но я не хочу попасть к сумасшедшим», — сказала Алиса."],
    ["'Oh, you can't help that,' said the Cat. 'We're all mad here.'", "«Ну, тут уж ничего не поделаешь, — сказал Кот. — Мы все здесь сумасшедшие»."],
    ["Then he slowly disappeared, starting with his tail and ending with his grin.", "Потом он медленно исчез, начиная с хвоста и заканчивая улыбкой."]] }],
  gloss: { large: "большой", shelves: "полки (shelf)", golden: "золотой", pie: "пирог", rabbit: "кролик", hurried: "поспешил", curiosity: "любопытство", hole: "нора, дыра", jars: "банки", landed: "приземлилась", pile: "куча", hall: "зал", locked: "запертый", tiny: "крошечный", curtain: "занавеска", label: "ярлык", tasted: "попробовала; на вкус", cherry: "вишня", custard: "заварной крем", turkey: "индейка", inches: "дюймы", curiouser: "чудесатее (шутливое слово)", grinning: "ухмыляясь", ought: "следует, должен", deal: "много (a good deal)", mad: "сумасшедший", tail: "хвост", grin: "улыбка, ухмылка", cheshire: "чеширский" } },

{ id: "b-holmes", lvl: "B1", title: "Sherlock Holmes: The Red-Headed League", author: "Arthur Conan Doyle · адаптация", about: "Странное объявление, клуб рыжеволосых и тайна, которую раскрывает Шерлок Холмс.",
  chapters: [
  { t: "A Strange Advertisement", pairs: [
    ["One autumn morning a fat, red-haired man came to see Sherlock Holmes.", "Однажды осенним утром к Шерлоку Холмсу пришёл полный рыжеволосый мужчина."],
    ["His name was Jabez Wilson, and he owned a small pawnshop in London.", "Его звали Джейбез Уилсон, и у него был маленький ломбард в Лондоне."],
    ["He showed Holmes an old newspaper advertisement.", "Он показал Холмсу старое объявление из газеты."],
    ["It said that the Red-Headed League was looking for a man with bright red hair.", "В нём говорилось, что Союз рыжих ищет человека с ярко-рыжими волосами."],
    ["The job was easy and very well paid: he only had to copy an encyclopaedia every morning.", "Работа была лёгкой и очень хорошо оплачиваемой: каждое утро нужно было только переписывать энциклопедию."],
    ["His young assistant, Vincent, had encouraged him to apply.", "Его молодой помощник Винсент уговорил его подать заявку."],
    ["For eight weeks Wilson copied the encyclopaedia and received his money.", "Восемь недель Уилсон переписывал энциклопедию и получал деньги."],
    ["But that morning he found a note on the door: 'The Red-Headed League is dissolved.'", "Но в то утро он нашёл на двери записку: «Союз рыжих распущен»."]] },
  { t: "Holmes Thinks", pairs: [
    ["Holmes listened carefully and asked about the assistant.", "Холмс внимательно выслушал и расспросил о помощнике."],
    ["Vincent had agreed to work for half the usual salary.", "Винсент согласился работать за половину обычной зарплаты."],
    ["He liked photography and spent a lot of time in the cellar.", "Он увлекался фотографией и проводил много времени в подвале."],
    ["'This is a three-pipe problem,' said Holmes, and he sat in silence for almost an hour.", "«Это задача на три трубки», — сказал Холмс и почти час сидел молча."],
    ["Then he went to the pawnshop and knocked on the pavement with his stick.", "Потом он пошёл к ломбарду и постучал тростью по тротуару."],
    ["When Vincent opened the door, Holmes looked only at the knees of his trousers.", "Когда Винсент открыл дверь, Холмс посмотрел только на колени его брюк."],
    ["They were dirty and worn, as if he had been digging.", "Они были грязными и протёртыми, будто он копал."],
    ["Behind the pawnshop, Holmes noticed, there was a large bank.", "За ломбардом, как заметил Холмс, находился большой банк."]] },
  { t: "The Tunnel", pairs: [
    ["That night Holmes, Watson, a police inspector and the bank manager waited in the dark cellar of the bank.", "Той ночью Холмс, Ватсон, инспектор полиции и управляющий банком ждали в тёмном подвале банка."],
    ["There was a fortune in French gold hidden there.", "Там было спрятано целое состояние во французском золоте."],
    ["After an hour, a stone in the floor moved, and a hand appeared.", "Через час камень в полу сдвинулся, и показалась рука."],
    ["It was Vincent, whose real name was John Clay, one of the cleverest criminals in London.", "Это был Винсент, настоящее имя которого — Джон Клей, один из самых хитрых преступников Лондона."],
    ["The police arrested him and his partner immediately.", "Полиция немедленно арестовала его и его сообщника."],
    ["Later Holmes explained to Watson: the League was only a trick to keep Wilson away from his shop.", "Позже Холмс объяснил Ватсону: Союз был лишь уловкой, чтобы держать Уилсона подальше от его лавки."],
    ["While Wilson was copying the encyclopaedia, Clay was digging a tunnel to the bank.", "Пока Уилсон переписывал энциклопедию, Клей рыл туннель к банку."],
    ["'It is quite simple when you know where to look,' Holmes said with a smile.", "«Всё очень просто, когда знаешь, куда смотреть», — с улыбкой сказал Холмс."]] }],
  gloss: { well: "хорошо", copy: "переписывать, копировать", lot: "много (a lot of)", "three-pipe": "«на три трубки» — о трудной задаче", gold: "золото; золотой", large: "большой", "red-haired": "рыжеволосый", "red-headed": "рыжий", league: "союз, лига", pawnshop: "ломбард", advertisement: "объявление", encyclopaedia: "энциклопедия", assistant: "помощник", note: "записка", dissolved: "распущен", usual: "обычный", photography: "фотография", cellar: "подвал", pipe: "трубка", silence: "тишина", pavement: "тротуар", stick: "трость", worn: "протёртый, изношенный", digging: "копая", inspector: "инспектор", fortune: "состояние, богатство", hidden: "спрятанный", criminals: "преступники", partner: "сообщник, партнёр", trick: "уловка, трюк", tunnel: "туннель", observe: "наблюдать, замечать" } },

{ id: "b-fire", lvl: "B2", title: "To Build a Fire", author: "Jack London · адаптация", about: "Человек идёт один по замёрзшей Аляске при минус пятидесяти. Суровая история о природе и самоуверенности.",
  chapters: [
  { t: "Seventy-Five Below", pairs: [
    ["The day had dawned cold and grey, exceedingly cold and grey, when the man turned aside from the main Yukon trail.", "День начался холодный и серый, необычайно холодный и серый, когда человек свернул с главной юконской тропы."],
    ["There was no sun, although there was not a cloud in the sky.", "Солнца не было, хотя на небе не было ни облачка."],
    ["It was seventy-five degrees below zero, but the man did not think much about it.", "Было семьдесят пять градусов ниже нуля по Фаренгейту, но человек особо об этом не задумывался."],
    ["He was a newcomer to the land, and he lacked imagination.", "Он был новичком в этих краях, и ему не хватало воображения."],
    ["Cold meant to him only discomfort, not the danger of death.", "Холод означал для него лишь неудобство, а не опасность смерти."],
    ["An old man had warned him never to travel alone when it was colder than fifty below.", "Один старик предупреждал его никогда не ходить в одиночку, когда мороз сильнее пятидесяти."],
    ["But the man had laughed; he was strong, and he would reach the camp by six o'clock.", "Но человек посмеялся: он был сильным и доберётся до лагеря к шести часам."],
    ["Only his dog, a big husky, understood instinctively that it was no time for travelling.", "Только его собака, большая хаски, инстинктивно понимала, что сейчас не время для путешествий."]] },
  { t: "The Fire", pairs: [
    ["Around noon, the man broke through the ice and wet his legs up to the knees.", "Около полудня человек провалился под лёд и промочил ноги до колен."],
    ["He knew he had to build a fire at once to dry his socks and boots.", "Он знал, что нужно немедленно развести костёр, чтобы высушить носки и ботинки."],
    ["He made the fire carefully under a large spruce tree and began to feel safe again.", "Он аккуратно развёл огонь под большой елью и снова почувствовал себя в безопасности."],
    ["But each time he pulled a twig, he shook the tree slightly.", "Но каждый раз, когда он тянул ветку, он слегка тряс дерево."],
    ["High above, snow had collected on the branches.", "Высоко наверху на ветвях скопился снег."],
    ["Suddenly it fell, and the fire was blotted out.", "Вдруг он рухнул вниз, и костёр погас."],
    ["The man sat and looked at the place where the fire had been. He was shocked.", "Человек сидел и смотрел на место, где только что был огонь. Он был потрясён."],
    ["Perhaps the old man had been right after all.", "Возможно, старик всё-таки был прав."]] },
  { t: "The Dog", pairs: [
    ["His fingers were already numb, and he could hardly hold the matches.", "Его пальцы уже онемели, и он едва мог держать спички."],
    ["He lit all the matches at once, but the flame died in the snow.", "Он зажёг все спички разом, но пламя погасло в снегу."],
    ["Panic took hold of him, and he began to run along the trail.", "Его охватила паника, и он побежал по тропе."],
    ["After a while he fell and could not get up again.", "Через какое-то время он упал и больше не смог подняться."],
    ["A great calm came over him, and he thought it was not so bad to die like this.", "На него снизошло великое спокойствие, и он подумал, что умереть так — не так уж и плохо."],
    ["The dog sat waiting, puzzled that the man did not make a fire.", "Собака сидела и ждала, недоумевая, почему человек не разводит огонь."],
    ["Later, when it smelled death, it howled once under the stars.", "Позже, почуяв смерть, она один раз завыла под звёздами."],
    ["Then it trotted along the trail towards the camp, where there were other food-providers and fire-providers.", "Потом она потрусила по тропе к лагерю, где были другие, кто даёт еду и огонь."]] }],
  gloss: { main: "главный", "seventy-five": "семьдесят пять", zero: "ноль", land: "земля, край", death: "смерть", fifty: "пятьдесят", large: "большой", shook: "тряс (shake)", branches: "ветви", shocked: "потрясённый", lit: "зажёг (light)", smelled: "почуяла (smell)", "food-providers": "те, кто даёт еду", "fire-providers": "те, кто даёт огонь", dawned: "начался, рассвёл", exceedingly: "чрезвычайно", trail: "тропа", yukon: "Юкон (регион и река)", newcomer: "новичок", lacked: "не хватало", imagination: "воображение", discomfort: "неудобство", warned: "предупредил", camp: "лагерь", husky: "хаски", instinctively: "инстинктивно", noon: "полдень", spruce: "ель", twig: "веточка", slightly: "слегка", collected: "скопился", blotted: "погашен, стёрт", numb: "онемевший", matches: "спички", flame: "пламя", panic: "паника", calm: "спокойствие", puzzled: "озадаченный", howled: "завыла", trotted: "побежала трусцой", providers: "те, кто обеспечивает" } }
];

/* Известные цитаты и пословицы. */
const QUOTES = [
  { lvl: "A1", en: "Slow and steady wins the race.", ru: "Тише едешь — дальше будешь.", src: "Aesop, «The Tortoise and the Hare»" },
  { lvl: "A1", en: "Practice makes perfect.", ru: "Повторение — мать учения (практика ведёт к совершенству).", src: "Пословица" },
  { lvl: "A2", en: "Better late than never.", ru: "Лучше поздно, чем никогда.", src: "Пословица" },
  { lvl: "A2", en: "Actions speak louder than words.", ru: "Дела говорят громче слов.", src: "Пословица" },
  { lvl: "A2", en: "A friend in need is a friend indeed.", ru: "Друг познаётся в беде.", src: "Пословица" },
  { lvl: "A2", en: "Where there's a will, there's a way.", ru: "Где есть желание, там есть и возможность.", src: "Пословица" },
  { lvl: "B1", en: "Curiouser and curiouser!", ru: "Всё чудесатее и чудесатее!", src: "Lewis Carroll, «Alice's Adventures in Wonderland»" },
  { lvl: "B1", en: "We're all mad here.", ru: "Мы все здесь сумасшедшие.", src: "Lewis Carroll, «Alice's Adventures in Wonderland»" },
  { lvl: "B1", en: "You see, but you do not observe.", ru: "Вы смотрите, но не наблюдаете.", src: "Arthur Conan Doyle, «A Scandal in Bohemia»" },
  { lvl: "B1", en: "Early to bed and early to rise makes a man healthy, wealthy, and wise.", ru: "Кто рано ложится и рано встаёт, здоровье, богатство и ум наживёт.", src: "Benjamin Franklin" },
  { lvl: "B1", en: "All the world's a stage.", ru: "Весь мир — театр.", src: "William Shakespeare, «As You Like It»" },
  { lvl: "B1", en: "To be, or not to be: that is the question.", ru: "Быть или не быть — вот в чём вопрос.", src: "William Shakespeare, «Hamlet»" },
  { lvl: "B2", en: "The course of true love never did run smooth.", ru: "Путь истинной любви никогда не был гладким.", src: "William Shakespeare, «A Midsummer Night's Dream»" },
  { lvl: "B2", en: "We are all in the gutter, but some of us are looking at the stars.", ru: "Все мы в сточной канаве, но некоторые из нас смотрят на звёзды.", src: "Oscar Wilde, «Lady Windermere's Fan»" },
  { lvl: "B2", en: "I can resist everything except temptation.", ru: "Я могу устоять перед чем угодно, кроме искушения.", src: "Oscar Wilde, «Lady Windermere's Fan»" },
  { lvl: "B2", en: "Why, sometimes I've believed as many as six impossible things before breakfast.", ru: "Иной раз я успевала поверить в целых шесть невозможных вещей ещё до завтрака.", src: "Lewis Carroll, «Through the Looking-Glass»" },
  { lvl: "B2", en: "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.", ru: "Если исключить невозможное, то, что останется, каким бы невероятным оно ни было, и есть правда.", src: "Arthur Conan Doyle, «The Sign of the Four»" },
  { lvl: "B2", en: "It was the best of times, it was the worst of times.", ru: "Это было лучшее из времён, это было худшее из времён.", src: "Charles Dickens, «A Tale of Two Cities»" },
  { lvl: "B2", en: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", ru: "Все знают, что молодой человек, располагающий средствами, должен подыскивать себе жену.", src: "Jane Austen, «Pride and Prejudice»" }
];
