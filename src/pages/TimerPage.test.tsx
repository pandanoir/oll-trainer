/**
 * @jest-environment jsdom
 */
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../App';

jest.mock('../components/common/ToggleButton.css', () => '');
jest.mock('../components/Timer/StatisticsModal', () => '');
jest.mock('../sound/steady.mp3', () => '');
jest.mock('../sound/eightSeconds.mp3', () => '');
jest.mock('../sound/twelveSeconds.mp3', () => '');
jest.mock('../features/timer/components/Timer.css', () => '');

jest.mock('./TopPage', () => ({ TopPage: () => null }));
jest.mock('./CpPage', () => ({ CpPage: () => null }));
jest.mock('./EoQuizPage', () => ({ EoQuizPage: () => null }));
jest.mock('./InspectionPage', () => ({ InspectionPage: () => null }));
jest.mock('./LearningPage', () => ({ LearningPage: () => null }));
jest.mock('./OllPage', () => ({ OllPage: () => null }));
jest.mock('./ScramblePage', () => ({ ScramblePage: () => null }));
jest.mock('./TimerPage.css', () => '');

jest.mock('../index.css', () => ({ TimerPage: () => null }));
jest.mock('../swiper.css', () => '');
jest.useFakeTimers();

describe('TimerPage', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  beforeEach(() => {
    const randomValues = [
      0.5574143520478441, 0.5445261978509874, 0.1058732414642638,
      0.31777855807232047, 0.456741719823746, 0.7402982228392434,
      0.44500967511961154, 0.9878472315829188, 0.9485434889144337,
      0.8258762198323097, 0.432070768967614, 0.1711110576236401,
      0.8284966430103835, 0.9094894039472476, 0.6429208034432774,
      0.5320729932135506, 0.7376412825933862, 0.8693269390783991,
      0.4947353736441884, 0.4489598063620992, 0.9063012470917358,
      0.513149869486107, 0.7628895826967375, 0.14107255826096976,
      0.8212415228726848, 0.15132973371559988, 0.9265858054671532,
      0.14018963669175633, 0.9048642113093934, 0.2586688429549082,
      0.6980915177469147, 0.9346002488449687, 0.02403263552872925,
      0.1633552018159301, 0.026026268196990276, 0.7692686224305854,
      0.4050248441794071, 0.9056923708892104, 0.2268783721960026,
      0.47235591948987365, 0.08665970938380907, 0.30135478260971205,
      0.07197860321298255, 0.7596555488130454, 0.02881930370701169,
      0.880163805694695, 0.968803777448876, 0.11808717596266338,
      0.18171582033015965, 0.2793362695894581, 0.6535318858433388,
      0.5995108455948908, 0.09198846375652181, 0.5320901902202011,
      0.5194367297265186, 0.351351896877381, 0.7240545024691354,
      0.7796597663512466, 0.4695243868019776, 0.34909926680079373,
      0.30133586203755924, 0.5651374481787612, 0.23706410882156304,
      0.2535638720532565, 0.35531531229290714, 0.49139725552158464,
      0.4112631447812678, 0.2406258774519574, 0.7261557491517538,
      0.23202058630896882, 0.8150477791902893, 0.29317386485910846,
      0.7520018048398112, 0.437768576491393, 0.5863026559911713,
      0.5536745096243882, 0.42234521718034657, 0.13529476663382978,
      0.05936804486353764, 0.11289336600488054, 0.7535443097520205,
      0.6367071266022395, 0.32800044951838525, 0.7814935711346924,
      0.8733766397598495, 0.792274935769276, 0.15342702810073483,
      0.5742205970820029, 0.8186817643356386, 0.23480433157463443,
      0.9293274881222044, 0.4866257521346382, 0.6654138840443802,
      0.876428748755359, 0.011005554734464962, 0.5271012058884383,
      0.4448336315136281, 0.895199664976094, 0.31657704978744117,
      0.25175022535056435, 0.6025896720727519, 0.9634604661638917,
      0.4562316053446067, 0.5817996368829441, 0.27765830195795194,
      0.32507520954100855, 0.9747582588560673, 0.921681553712739,
      0.5578226580836185, 0.32702174342129386, 0.7322069881688633,
      0.5246857919699024, 0.08885624055883268, 0.07017952254960824,
      0.7706587025929923, 0.8649234817519369, 0.24258174292408774,
      0.8557547593386061, 0.5315064699895253, 0.9049558288706292,
      0.2682230673118653, 0.3482130738653335, 0.6946287957780879,
      0.35717972532274866, 0.5005512733610378, 0.8322750396829841,
      0.14261286783169091, 0.8285885032158011, 0.5038575933119134,
      0.7081724860172904, 0.8452101861652057, 0.04035918752509393,
      0.663831768549719, 0.6812297169842185, 0.616196346547399,
      0.705730143673889, 0.5932248527100361, 0.14381385206027542,
      0.6345464072593561, 0.1415851873460956, 0.22205552393220662,
      0.10639346011675088, 0.7159412599353889, 0.7540215763668805,
      0.694469067982719, 0.893849441833241, 0.6113559946426328,
      0.4329933033042763, 0.4779083170019447, 0.42632907332786063,
      0.8832009981318525, 0.11526531852873911, 0.7427857228253281,
      0.6863818224880607, 0.25292102302576924, 0.05601452354920089,
      0.8403983832357023, 0.12940072655809964, 0.07675515377647457,
      0.3234218807438205, 0.08860687527918998, 0.2197372299372562,
      0.6088486561563133, 0.7154959536707985, 0.8975670082470124,
      0.9455033097781729, 0.3603222723839792, 0.5924872428294965,
      0.1282803915777666, 0.19245225481986306, 0.862854934047288,
      0.3534361980168732, 0.23073169475489985, 0.5781526516258229,
      0.5849784886550344, 0.5153246532076448, 0.35094229130873233,
      0.4598002059175441, 0.716207099720825, 0.06810543849693262,
      0.2363576417405875, 0.7492665732885178, 0.47149908355351333,
      0.4735008172228563, 0.11891330776127806, 0.498561632309793,
      0.6941982286051551, 0.09072039703881529, 0.05202659027102641,
      0.9963980789672326, 0.313047246254035, 0.8354203081369316,
      0.1372502308951571, 0.4409378051347561, 0.10772565394354228,
      0.5005735062714236, 0.575598720890871, 0.9783202302876186,
      0.4271137735306736, 0.9890544908530678, 0.9316055169765758,
      0.1982696212632784, 0.1943519029248022, 0.4177533881468545,
      0.7015555988362034, 0.7792499205466443, 0.8354818378717319,
      0.02356840138658467, 0.28106553298351633, 0.2546538118251924,
      0.9184461747579284, 0.5964703795574064, 0.6110929175587043,
      0.7224000376553086, 0.35472315471372595, 0.6117759341091078,
      0.07320974252029533, 0.20817681933808663, 0.41759315741681524,
      0.15881853877370689, 0.18576412543401588, 0.0683959827948506,
      0.21324646873671238, 0.5017238442776413, 0.18426735410290873,
      0.93487849833168, 0.550452268016721, 0.01835219890342299,
      0.31399593885458743, 0.474091908688133, 0.8431336874701896,
      0.40258428897886667, 0.05616328060699072, 0.41569411895339914,
      0.19416753470180326, 0.6236197671309949, 0.04123659647178535,
      0.11550230194226607, 0.08321559537286172, 0.8091991878968154,
      0.37661084254034427, 0.022994955384235016, 0.6525860738561091,
      0.13735920273159175, 0.0013356825544659223, 0.4246383084891445,
      0.8976641340122378, 0.9135271760840722, 0.9549452031041317,
      0.670415963067716, 0.015184683820080203, 0.06639715690919346,
      0.5784284505346682, 0.7762173723220418, 0.009458221870305872,
      0.32852036541680296, 0.6310036077916994, 0.8660725312854336,
      0.8240918734955989, 0.8278033568852734, 0.6768827048752755,
      0.9417207910271834, 0.8737158197751236, 0.082745937429614,
      0.47674485321948135, 0.4784101347250149, 0.6819657901790648,
      0.678283628687139, 0.9814748728956595, 0.1379474949548909,
      0.8918371481676486, 0.06573460614241733, 0.8483497117149721,
      0.42238433932570585, 0.005474651426090382, 0.9278513792673202,
      0.6576059184622569, 0.09122280148805761, 0.8562007416860196,
      0.09644649399940719, 0.7050247750661232, 0.3102620707963182,
      0.785674356943423, 0.46137391790486015, 0.09859510045627418,
      0.7798171828093274, 0.03396890600173763, 0.21626138328558753,
      0.4701086616694081, 0.13143878366135353, 0.5338196537135858,
      0.7736050407533028, 0.38962044432367016, 0.31961392816212464,
      0.8788263586298455, 0.5284308448600721, 0.6206351487712691,
      0.2522856412452501, 0.07930765032112652, 0.12485686465333745,
      0.5889714497567402, 0.4296170346414019, 0.12174759995662554,
      0.7362441786899505, 0.8379003358137795, 0.4768347818957188,
      0.49616751986827423, 0.2012152926033044, 0.5796623047837399,
      0.6324979095031011, 0.9289587551611111, 0.3972199156620333,
      0.8811196582123777, 0.31526551608889264, 0.013839089629290369,
      0.048464819483015065, 0.6088829730815846, 0.7236067273369158,
      0.45371500718318103, 0.20917200696713367, 0.9844662929430188,
      0.1765229249404372, 0.44683726287420655, 0.5794939748210364,
      0.9657162507119763, 0.3979860574522873, 0.12247199449005741,
      0.9283600556973779, 0.19360813656276532, 0.5745948921567399,
      0.621525912350819, 0.2655547037713173, 0.032595375901018686,
      0.6215088165924476, 0.5765990041412403, 0.9048644207177436,
      0.4614521274912702, 0.9500467044754386, 0.25716600043617155,
      0.05635639864866926, 0.5921063237703847, 0.055498313065010185,
      0.7751688211289927, 0.9513563196090327, 0.6006929484328318,
      0.6034063027254162, 0.6207133072180573, 0.7664677801821909,
      0.9159872162529474, 0.9915951283476427, 0.39369087826328397,
      0.4555692587484972, 0.10197449217192656, 0.19443063414141304,
      0.30812566226168414, 0.9353304581428064, 0.7205250383786332,
      0.2555773362549485, 0.32999142137849335, 0.30090288448291846,
      0.6233263644097937, 0.23596464795614502, 0.038837035206742865,
      0.8598595752970337, 0.9405918294290958, 0.9785488649929048,
      0.10144580327473451, 0.07455503215180537, 0.7563614599906794,
      0.9448453352522772, 0.36886732940828226, 0.11677726470632988,
      0.4821340110611916, 0.5471924443786633, 0.5948950570066165,
      0.820861074368157, 0.13060896612167383, 0.4570526510023851,
      0.46053661477959684, 0.008460523005205722, 0.3262459208692967,
      0.0064919367577982445, 0.7610442121482268, 0.5423177823823309,
      0.9695775305743977, 0.9985085384669812, 0.6037790315335347,
      0.8052000604487235, 0.011960070462341266, 0.16721021005725323,
      0.1793270130473097, 0.27366569692252685, 0.13324109184526356,
      0.6219406105332146, 0.3521951320622214, 0.03433249044686604,
      0.6863365160841173, 0.5741948138593329, 0.5472817054676997,
      0.6641300566855874, 0.09246995379138867, 0.7627862090846174,
      0.5862515284626848, 0.4818940377083625, 0.36069556377879763,
      0.5402894827340812, 0.6247040377531017, 0.02389789541999976,
      0.7431856578688212, 0.6449685233013889, 0.004352820223259002,
      0.9765422781912512, 0.952009683164738, 0.8255863008414366,
      0.7394418258398392, 0.7301671304623767, 0.8955364091705793,
      0.2694189675775056, 0.17031044239476612, 0.5088329227350759,
      0.5501938038550824, 0.17064000908482546, 0.22271306741000196,
      0.34629336466979566, 0.6781862733054917, 0.509473856232328,
      0.47052852414688573, 0.3976380377199036, 0.9762011637636376,
      0.514575615337427, 0.2547718563217567, 0.8321057667617651,
      0.00809080441501453, 0.39371856481746126, 0.6522148550416114,
      0.26903361402619086, 0.23129830934114337, 0.7636477633339653,
      0.868043440598417, 0.19205369633723968, 0.3483148469698063,
      0.6508239277701955, 0.4070206394057021, 0.5231557242860518,
      0.5816256372383286, 0.11456156352325908, 0.38239108413591705,
      0.3124349356149587, 0.5057841066617732, 0.005103306845821276,
      0.3613631561009487, 0.7191847440852526, 0.2770698826939886,
      0.4089825853027007, 0.5232339704810303, 0.17956337365847808,
      0.3612803167088514, 0.7153229446055263, 0.31513210936043756,
      0.6967357797223996, 0.293851812269337, 0.6156455748679801,
      0.23449539143738618, 0.5184893781096886, 0.6187260331804769,
      0.11801922550128019, 0.737990169201979, 0.029620605199003114,
      0.397608860716383, 0.1514824948303135, 0.589344958689829,
      0.5573784404710085, 0.2151441795225082, 0.2517865867532907,
      0.6545098800769129, 0.8351710076482837, 0.3876147351596795,
      0.5884646327808225, 0.581852243011044, 0.9147425780489182,
      0.8165051563966095, 0.4541535747296144, 0.11683639543068147,
      0.3589831824901022, 0.2755055430043569, 0.7859823500475003,
      0.25368569011408115, 0.7130887803124375, 0.6133170628442324,
      0.2639377602024353, 0.5763116241913888, 0.10097882605910469,
      0.5616920020472531, 0.6486392245274204, 0.6997290378918817,
      0.694424109958196, 0.22174563730531327, 0.901841573356758,
      0.6036079249409387, 0.19171634935894666, 0.36385190054612493,
      0.967096997255185, 0.4284518692177115, 0.6856017363015483,
      0.7511460792300173, 0.5341170911912516, 0.521510339082724,
      0.4646742920425886, 0.5984856385101984, 0.21213505861796245,
      0.614273690723143, 0.6917623402995492, 0.21558882299320659,
      0.4791215841938534, 0.96876915804391, 0.09989578798640841,
      0.7806281029566751, 0.897957829593026, 0.894838664279821,
      0.5141487733562025, 0.18121591626457323, 0.46031437449725,
      0.781793305447918, 0.2870737260841856, 0.4647815188611275,
      0.3794867240946429, 0.01733470879462473, 0.31129123778188994,
      0.3608323445648953, 0.3180853438121367, 0.22877004352837305,
      0.9926859838273585, 0.7021772225589855, 0.19642895444171327,
      0.4826179714951959, 0.6353019380020593, 0.9699964679277915,
      0.15319687024259676, 0.8702541597573159, 0.8121204628119922,
      0.7027668518846151, 0.1915446878529934, 0.5804824933790409,
      0.2745376694289916, 0.9814049200789068, 0.23248297299343856,
      0.6900185868657183, 0.6234067774910022, 0.7599950943795666,
      0.8133598031143401, 0.9816374676225796, 0.2703855551138159,
      0.878287001826483, 0.9234387024894077, 0.41284434730411945,
      0.1822661960012366, 0.4008063233991972, 0.25113118089534936,
      0.31623166340706454, 0.2434786776616058, 0.16335609901866643,
      0.4278598400071154, 0.014163050788956966, 0.6414435850994875,
      0.6046681689882583, 0.23288691294198371, 0.9891490174586324,
      0.42371936648504893, 0.46562026741351725, 0.5564283827409755,
      0.34507174840489885, 0.5209061296172435, 0.8675397648985186,
      0.8737036608620927, 0.24694552949915471, 0.14144489386139525,
      0.9633328214439725, 0.0208923745445333, 0.5435389843204215,
      0.8105261628562526, 0.8257097710055579, 0.6541928925547813,
      0.7895816258290367, 0.21843604496177793, 0.23045572974333095,
      0.24904289228477583, 0.016356230279693795, 0.34977595619487056,
      0.6459716525774719, 0.5375738690099865, 0.6012167582108829,
      0.8551134814617287, 0.6466451764777652, 0.3005476238080407,
      0.4748632390600145, 0.12671233204345178, 0.654126405054541,
      0.9403033813924861, 0.03134445835428634, 0.7714357663883535,
      0.9362808627967925, 0.4404523791993413, 0.7146556570706153,
      0.989419249570628, 0.48218705541786466, 0.3453786216285881,
      0.9780999242775006, 0.4635005987544403, 0.40521608828433164,
      0.3547306413900946, 0.8797361684371503, 0.5812819223928805,
      0.18518762037417624, 0.5342138052891507, 0.026495770264705065,
      0.7711346500491536, 0.25976580433981544, 0.3700152455422039,
      0.36121407163200714, 0.05595064748762257, 0.7800040941296986,
      0.42986877633498954, 0.32374298352304254, 0.696833319279035,
      0.5543693813527593, 0.5646338085703453, 0.3784471142591308,
      0.9473921073987237, 0.15795168002374638, 0.05568240054448115,
      0.35144132368199044, 0.24754016516064525, 0.5897754357964868,
      0.7014343860577124, 0.8607261149193783, 0.7786042283315968,
      0.16070082139354325, 0.0004628814914002799, 0.4912656941422109,
      0.41751862654835503, 0.7109921615956851, 0.7745012994709188,
      0.6456144847923555, 0.12553528096838606, 0.7625449031248699,
      0.40021568787375883, 0.6653236220888141, 0.3612293677284557,
      0.5355483885849193, 0.6776979528908933, 0.7360783331307426,
      0.2245067546235986, 0.6393295706907314, 0.33976612061264255,
      0.393444606061623, 0.3138690451660384, 0.59288008657966,
      0.8980400722845314, 0.11252599159650556, 0.9360652074882418,
      0.20171174444181594, 0.3536435992183773, 0.5005501401887773,
      0.2956203897515801, 0.272703237028155, 0.0840807090943454,
      0.010390201062304927, 0.5151204564324001, 0.7779457896562405,
      0.16113298280421295, 0.8783619472439272, 0.7072350366823399,
      0.027728715344199628, 0.47055420762993627, 0.8248865214499954,
      0.4934230842869949, 0.592297462214689, 0.6863466828438727,
      0.22122240099759582, 0.13985368090534944, 0.9063687265892297,
      0.7047094701211425, 0.43547739978258004, 0.5282391738845127,
      0.9197978988345941, 0.7656023128438105, 0.688104581405981,
      0.4497822527733579, 0.0651591809825407, 0.625436158658089,
      0.577248828231149, 0.5586487934224595, 0.3909446563665393,
      0.8950798577660066, 0.781157526563609, 0.05713309928674137,
      0.4979573144300038, 0.053581891781200985, 0.588836299459979,
      0.3634049622381006, 0.5381951641514819, 0.332392037775181,
      0.6105228963348954, 0.013526653016928902, 0.5231316493189109,
      0.6550417907786448, 0.14252722549939434, 0.6627886492656085,
      0.8384131618992552, 0.14967719902003207, 0.28402992723084,
      0.7892860942111064, 0.8652323930420487, 0.9613762951588833,
      0.2995154148920862, 0.13743336201744283, 0.18925456699995302,
      0.9149420230633314, 0.12706410642652788, 0.024689412174728753,
      0.2682630282247356, 0.6195630861428152, 0.14161479401808008,
      0.979269415333488, 0.9147454746363786, 0.1533096095715858,
      0.7532132928054025, 0.17270336107299133, 0.4952432597873071,
      0.6052602268982117, 0.28932293419249655, 0.6930679537177469,
      0.9556070640085186, 0.06128409993515449, 0.05876278323118034,
      0.7778322434082885, 0.6159811418538432, 0.2152990612904131,
      0.019135437111774234, 0.886172034384656, 0.05631564944795309,
      0.4285696153534897, 0.2951101252409205, 0.8984203058137712,
      0.5487708011912713, 0.5233210234337731, 0.6657540369392068,
      0.6027356040912086, 0.25596552418726737, 0.41311069673229706,
      0.14054978440331678, 0.8466277804803983, 0.7336206736679722,
      0.7422514993050522, 0.08156908357902504, 0.4966394704644106,
      0.7791157573053706, 0.9404173236845172, 0.746216241625099,
      0.23375027830501405, 0.4169216074007256, 0.12374488206437917,
      0.3884017572137841, 0.632132037107421, 0.5021459172456302,
      0.42072573812671354, 0.520757368955197, 0.7331823507944768,
      0.9676950731770362, 0.677237178345705, 0.26459242093879887,
      0.0882590974132198, 0.3628945396102612, 0.03866294194353004,
      0.2484916945076403, 0.6235521630623011, 0.22180004091120886,
      0.75711243166861, 0.7418809258350179, 0.2520019098792121,
      0.5592959459293119, 0.4760180369212321, 0.1732253854467085,
      0.11632720020789478, 0.4095341382940443, 0.3925521454927048,
      0.9832439381219671, 0.2758006869426284, 0.19665331368834238,
      0.11692731508043197, 0.04318477432947776, 0.45311288774227254,
      0.12021307936703463, 0.5139681020121092, 0.08454031168549059,
      0.14230486114930363, 0.22831905434121702, 0.6291864807996819,
      0.7510965294910807, 0.9575857615307546, 0.5851008448130011,
      0.5667302543160406, 0.08922589665519909, 0.3565314842987817,
      0.2695871631470603, 0.8561730111981025, 0.882791817107135,
      0.39526002108934644, 0.9091555385081087, 0.9220746018053938,
      0.00245595168150059, 0.30758459962143436, 0.263242847051375,
      0.0892034894935958, 0.08711818045528075, 0.7393747260153098,
      0.14992696671652994, 0.6619066234358086, 0.3624460491595263,
      0.01793705726603112, 0.5507567918986052, 0.9637257451524777,
      0.9010653034289748, 0.3860657749750165, 0.057063882652051534,
      0.2478514105270011, 0.33260457441252456, 0.6716381021086506,
      0.5865316879706259, 0.46490696576565704, 0.247761114645765,
      0.9225956966520126, 0.9861872795090938, 0.11532077500036442,
      0.3742668322464555, 0.9766215944139609, 0.4239995224766435,
      0.651966475153883, 0.1708092549056286, 0.9171708112527581,
      0.8774076858175717, 0.6209992862708638, 0.9149218296450621,
      0.7986015941433149, 0.02392925341222729, 0.3782866795192865,
      0.8855418582783405, 0.22803660855675023, 0.1772603940676727,
      0.5369797490857178, 0.9278418168254803, 0.5201442101253104,
      0.6741331537430757, 0.3072152617940733, 0.9723968630881108,
      0.34712063455315145, 0.7635976538451184, 0.31753644856072616,
      0.4620344510596621, 0.309843946415747, 0.2723442896645698,
      0.744376028143706, 0.1373592429421504, 0.7085005234813502,
      0.6500115618961255, 0.28963713028272164, 0.977240096047572,
      0.03544434584087108, 0.4491574176446118, 0.24404219052060983,
      0.8044500953731184, 0.9720515065452731, 0.5625102096976131,
      0.539071427120382, 0.17736056046797266, 0.3189557747688523,
      0.16027573765222303, 0.4193217847356523, 0.31117320710897634,
      0.40478530680719027, 0.9866504467136477, 0.6022894387623732,
      0.5241123291610923, 0.8362527834674043, 0.8715015124216832,
      0.35773793729210435, 0.7004586718377332, 0.573599156957957,
      0.17437637464508082, 0.3697798107117911, 0.24604920156548582,
      0.004034802951847771, 0.8753820508362515, 0.9417725876139109,
      0.23013987202183328, 0.4246424023427322, 0.2886540030153113,
      0.8044812151135978, 0.5827971776692602, 0.3056401121394523,
      0.8740100882479394, 0.8922927928729949, 0.9149522566735766,
      0.6751012366811089, 0.5199292618546438, 0.0022669031131834494,
      0.4973293518964885, 0.7966365461252933, 0.24155420505579106,
      0.0012936547620692185, 0.026984123241677205, 0.3479882924173727,
      0.8650829207828119, 0.8716358371313293, 0.48392170375130905,
      0.7765742996926759, 0.6562768319531977, 0.9452170874971599,
      0.8739365964468024, 0.9409161650619822, 0.3803836470568429,
      0.04975063959692849, 0.28664256853148373, 0.1200107761619138,
      0.17558866514290994, 0.20420575423608067, 0.9945683358996531,
      0.6567730172408823, 0.046935242945613576, 0.620005158055037,
      0.9170493448485593, 0.15920786407323972, 0.02596602060602593,
      0.4797293342052218, 0.08920960628246521, 0.30642117672017966,
      0.09800568301787616, 0.9850791298257926, 0.8918339020884463,
      0.008043182282658323, 0.32647272470763133, 0.8289219763405138,
      0.30583116874410665, 0.7486524758154898, 0.6376994041156623,
      0.5985806611632805, 0.8909323059068515, 0.3321196027923341,
      0.18352468307927183, 0.7859733937275732, 0.7793711574237945,
      0.3640865476437718, 0.6640498877085987, 0.13833985833057572,
      0.09216911953479956, 0.40718702823353903, 0.2623189969497459,
      0.4843535799967922, 0.35766582346365117, 0.15389275880613873,
      0.5194549804523598, 0.4742492093673567, 0.3053263070665273,
      0.6210525826262405, 0.1855034826619395, 0.7141875062748995,
      0.1030098814359095, 0.8426166154673334, 0.23564123442701268,
      0.6500267151551529, 0.07084137578244554, 0.24467868120989578,
      0.6249261738172802, 0.602972177330859, 0.7215643809744889,
      0.08952667753188037, 0.6507751982611165, 0.933108850648614,
      0.5944559352199905, 0.09829860175586091, 0.31796393561318115,
      0.4398106601352596, 0.32727068021161054, 0.24204780099106715,
      0.30081226082419854, 0.937887967064889, 0.12300177030227166,
      0.42106205443025835, 0.3250544255157326, 0.1371549497725304,
      0.1699501702891042, 0.74732240652848, 0.26252172509983174,
      0.9364628884221471, 0.3170831192484942, 0.20008189122129916,
      0.6177268010645498, 0.10694655332788106, 0.8868064164534173,
      0.41501981874835203,
    ];
    jest.spyOn(global.Math, 'random').mockImplementation(() => {
      const res = randomValues.pop();
      if (typeof res === 'undefined') {
        throw new Error();
      }
      return res;
    });
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });
  test('snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/oll/timer']} basename="/oll">
        <App />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
    act(() => {
      jest.advanceTimersByTime(1000 / 60);
    });
    expect(asFragment()).toMatchSnapshot();
  });
});