"use client";

import {
  Icon as IconifyIcon,
  type IconProps,
  type IconifyIcon as IconData,
} from "@iconify/react/offline";
import ArrowUpRightData from "@iconify-icons/lucide/arrow-up-right";
import ArrowDownRightData from "@iconify-icons/lucide/arrow-down-right";
import ArrowLeftData from "@iconify-icons/lucide/arrow-left";
import ArrowRightData from "@iconify-icons/lucide/arrow-right";
import BoxesData from "@iconify-icons/lucide/boxes";
import CheckCircle2Data from "@iconify-icons/lucide/circle-check";
import ShapesData from "@iconify-icons/lucide/shapes";
import PackageSearchData from "@iconify-icons/lucide/package-search";
import PackageData from "@iconify-icons/lucide/package";
import ImagePlusData from "@iconify-icons/lucide/image-plus";
import Layers2Data from "@iconify-icons/lucide/layers-2";
import ShieldCheckData from "@iconify-icons/lucide/shield-check";
import LogOutData from "@iconify-icons/lucide/log-out";
import SlidersHorizontalData from "@iconify-icons/lucide/sliders-horizontal";
import Loader2Data from "@iconify-icons/lucide/loader-circle";
import SaveData from "@iconify-icons/lucide/save";
import SearchData from "@iconify-icons/lucide/search";
import PlusData from "@iconify-icons/lucide/plus";
import XData from "@iconify-icons/lucide/x";
import PencilData from "@iconify-icons/lucide/pencil";
import Trash2Data from "@iconify-icons/lucide/trash-2";
import SparklesData from "@iconify-icons/lucide/sparkles";
import CheckIconData from "@iconify-icons/lucide/check";
import ChevronDownIconData from "@iconify-icons/lucide/chevron-down";
import ChevronUpIconData from "@iconify-icons/lucide/chevron-up";
import HeartData from "@iconify-icons/lucide/heart";
import SunData from "@iconify-icons/lucide/sun";

import ChevronRightData from "@iconify-icons/lucide/chevron-right";
import CircleData from "@iconify-icons/lucide/circle";

type AppIconProps = Omit<IconProps, "icon">;

// Bundle icon data locally so icons render during SSR without API requests.
function createIcon(data: IconData) {
  return function AppIcon(props: AppIconProps) {
    return (
      <IconifyIcon
        icon={data}
        ssr
        width={22}
        height={22}
        aria-hidden="true"
        {...props}
      />
    );
  };
}

export const ArrowUpRight = createIcon(ArrowUpRightData);
export const ArrowDownRight = createIcon(ArrowDownRightData);
export const ArrowLeft = createIcon(ArrowLeftData);
export const ArrowRight = createIcon(ArrowRightData);
export const Boxes = createIcon(BoxesData);
export const CheckCircle2 = createIcon(CheckCircle2Data);
export const Shapes = createIcon(ShapesData);
export const PackageSearch = createIcon(PackageSearchData);
export const Package = createIcon(PackageData);
export const ImagePlus = createIcon(ImagePlusData);
export const Layers2 = createIcon(Layers2Data);
export const ShieldCheck = createIcon(ShieldCheckData);
export const LogOut = createIcon(LogOutData);
export const SlidersHorizontal = createIcon(SlidersHorizontalData);
export const Loader2 = createIcon(Loader2Data);
export const Save = createIcon(SaveData);
export const Search = createIcon(SearchData);
export const Plus = createIcon(PlusData);
export const X = createIcon(XData);
export const Pencil = createIcon(PencilData);
export const Trash2 = createIcon(Trash2Data);
export const Sparkles = createIcon(SparklesData);
export const CheckIcon = createIcon(CheckIconData);
export const ChevronDownIcon = createIcon(ChevronDownIconData);
export const ChevronUpIcon = createIcon(ChevronUpIconData);
export const Heart = createIcon(HeartData);
export const Sun = createIcon(SunData);

export const ChevronRightIcon = createIcon(ChevronRightData);
export const CircleIcon = createIcon(CircleData);

const namedIcons = {
  arrow: ArrowRight,
  search: Search,
  heart: Heart,
  box: Package,
  check: CheckCircle2,
  sun: Sun,
};

export default function Icon({
  name,
  ...props
}: AppIconProps & { name: keyof typeof namedIcons }) {
  const Component = namedIcons[name];
  return <Component {...props} />;
}
